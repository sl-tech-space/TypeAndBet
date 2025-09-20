#!/bin/sh

set -e

echo "Nginx + ModSecurity コンテナを起動中..."

# ModSecurityログディレクトリを作成（権限エラーを回避）
echo "ModSecurityログディレクトリを作成中..."
mkdir -p /var/log/nginx/modsec_audit 2>/dev/null || true
mkdir -p /var/log/nginx/modsec_debug 2>/dev/null || true

# ログファイルを作成（権限エラーを回避）
touch /var/log/nginx/modsec_audit.log 2>/dev/null || true
touch /var/log/nginx/modsec_debug.log 2>/dev/null || true

# ModSecurity設定ファイルの権限を確認
if [ -f /etc/nginx/modsecurity/modsecurity.conf ]; then
    echo "ModSecurity設定ファイルを確認中..."
    chmod 644 /etc/nginx/modsecurity/modsecurity.conf 2>/dev/null || true
else
    echo "警告: ModSecurity設定ファイルが見つかりません"
fi

# 環境変数をテンプレートに適用
envsubst '${BACKEND} ${FRONTEND} ${SERVER_NAME} ${HTTP_PORT} ${HTTPS_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Nginx設定の構文チェック
echo "Nginx設定の構文チェック中..."
nginx -t

# Nginxを起動
echo "Nginx + ModSecurityを起動中..."
exec nginx -g "daemon off;"
