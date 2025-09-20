#!/bin/sh

set -e

echo "カスタムエントリーポイントスクリプトを実行中..."

# タイムゾーンの確認
echo "Timezone: ${TZ:-Asia/Tokyo}"

# Nginxユーザーとして実行されていることを確認
echo "実行ユーザー: $(whoami)"
echo "ユーザーID: $(id)"

# 標準のエントリーポイントスクリプトを無効化
echo "標準のModSecurity設定コピー処理をスキップ中..."
# 90-copy-modsecurity-config.shの処理を無効化

# ModSecurityログディレクトリを作成と権限設定
echo "ModSecurityログディレクトリを作成中..."
mkdir -p /var/log/nginx/modsec_audit 2>/dev/null || true
mkdir -p /var/log/nginx/modsec_debug 2>/dev/null || true

# ログファイルを作成と権限設定
touch /var/log/nginx/modsec_audit.log 2>/dev/null || true
touch /var/log/nginx/modsec_debug.log 2>/dev/null || true
touch /var/log/nginx/error.log 2>/dev/null || true
touch /var/log/nginx/access.log 2>/dev/null || true

# 権限の最終調整（nginxユーザー所有、適切な権限設定）
chown -R nginx:nginx /var/log/nginx 2>/dev/null || true
chmod -R 755 /var/log/nginx 2>/dev/null || true
chmod 644 /var/log/nginx/*.log 2>/dev/null || true

# PIDディレクトリの権限確認と調整
echo "PIDディレクトリの権限を確認中..."
ls -la /tmp/nginx/
chmod 777 /tmp/nginx 2>/dev/null || true

# Nginx設定ディレクトリの権限確認と調整
echo "Nginx設定ディレクトリの権限を確認中..."
ls -la /etc/nginx/
ls -la /etc/nginx/conf.d/
ls -la /etc/nginx/templates/

# 必要に応じて権限を調整
chmod 755 /etc/nginx 2>/dev/null || true
chmod 755 /etc/nginx/conf.d 2>/dev/null || true
chmod 755 /etc/nginx/templates 2>/dev/null || true

# カスタムModSecurity設定ファイルの確認
echo "カスタムModSecurity設定ファイルを確認中..."
if [ -d /etc/custom-modsecurity.d ] && [ "$(ls -A /etc/custom-modsecurity.d/*.conf 2>/dev/null)" ]; then
    echo "以下のカスタム設定ファイルが検出されました:"
    ls -la /etc/custom-modsecurity.d/*.conf
else
    echo "警告: カスタムModSecurity設定ファイルが見つかりません"
fi

# 環境変数をテンプレートに適用
echo "Nginx設定テンプレートを処理中..."
envsubst '${BACKEND} ${FRONTEND} ${SERVER_NAME} ${HTTP_PORT} ${HTTPS_PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf
envsubst '${BACKEND} ${FRONTEND} ${SERVER_NAME} ${HTTP_PORT} ${HTTPS_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# 生成されたファイルの確認
echo "生成された設定ファイルを確認中..."
ls -la /etc/nginx/nginx.conf
ls -la /etc/nginx/conf.d/default.conf

# Nginx設定の構文チェック
echo "Nginx設定の構文チェック中..."
nginx -t

# Nginxを起動
echo "Nginx + ModSecurityを起動中..."
exec nginx -g "daemon off;"
