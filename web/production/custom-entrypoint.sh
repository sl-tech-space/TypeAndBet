#!/bin/sh

set -e

# 本番環境用：起動ログを最低限に
echo "Starting Nginx production environment..."

# タイムゾーンの確認
echo "Timezone: ${TZ:-Asia/Tokyo}"

# 標準のエントリーポイントスクリプトを無効化
# 90-copy-modsecurity-config.shの処理を無効化

# ModSecurityログディレクトリを作成と権限設定（サイレント実行）
mkdir -p /var/log/nginx/modsec_audit 2>/dev/null || true
mkdir -p /var/log/nginx/modsec_debug 2>/dev/null || true

# ログファイルを作成と権限設定（サイレント実行）
touch /var/log/nginx/modsec_audit.log 2>/dev/null || true
touch /var/log/nginx/modsec_debug.log 2>/dev/null || true
touch /var/log/nginx/error.log 2>/dev/null || true
touch /var/log/nginx/access.log 2>/dev/null || true
touch /var/log/nginx/acme-challenge-access.log 2>/dev/null || true
touch /var/log/nginx/acme-challenge-error.log 2>/dev/null || true

# 権限の最終調整（サイレント実行）
chown -R nginx:nginx /var/log/nginx 2>/dev/null || true
chmod -R 755 /var/log/nginx 2>/dev/null || true
chmod 644 /var/log/nginx/*.log 2>/dev/null || true

# PIDディレクトリの権限調整（サイレント実行）
chmod 777 /tmp/nginx 2>/dev/null || true

# Nginx設定ディレクトリの権限調整（サイレント実行）
chmod 755 /etc/nginx 2>/dev/null || true
chmod 755 /etc/nginx/conf.d 2>/dev/null || true
chmod 755 /etc/nginx/templates 2>/dev/null || true

# certbotディレクトリの権限調整（サイレント実行）
chmod 755 /var/www/certbot 2>/dev/null || true

# SSL証明書ディレクトリの権限調整（マウント後の権限変更）
if [ -d /etc/letsencrypt ]; then
    chown -R nginx:nginx /etc/letsencrypt 2>/dev/null || true
    chmod -R 755 /etc/letsencrypt 2>/dev/null || true
    # 証明書ファイルの権限を適切に設定
    find /etc/letsencrypt -name "*.pem" -exec chmod 644 {} \; 2>/dev/null || true
fi

# ログローテーション設定（サイレント実行）
if [ -f /usr/local/bin/setup-logrotate.sh ]; then
    chmod +x /usr/local/bin/setup-logrotate.sh
    /usr/local/bin/setup-logrotate.sh > /dev/null 2>&1 &
fi

# カスタムModSecurity設定ファイルの確認（エラーのみ表示）
if [ ! -d /etc/custom-modsecurity.d ] || [ ! "$(ls -A /etc/custom-modsecurity.d/*.conf 2>/dev/null)" ]; then
    echo "Warning: ModSecurity configuration files not found"
fi

# 環境変数をテンプレートに適用
envsubst '${BACKEND} ${FRONTEND} ${SERVER_NAME} ${HTTP_PORT} ${HTTPS_PORT} ${SSL_CERTIFICATE_PATH} ${SSL_CERTIFICATE_KEY_PATH}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf
envsubst '${BACKEND} ${FRONTEND} ${SERVER_NAME} ${HTTP_PORT} ${HTTPS_PORT} ${SSL_CERTIFICATE_PATH} ${SSL_CERTIFICATE_KEY_PATH}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Nginx設定の構文チェック（エラーのみ表示）
if ! nginx -t > /dev/null 2>&1; then
    echo "Error: Nginx configuration syntax check failed"
    nginx -t
    exit 1
fi

# Cronデーモンをrootで起動（バックグラウンド）
echo "Starting cron daemon..."
crond &

# Nginxをrootで起動
echo "Starting Nginx..."
exec nginx -g "daemon off;"
