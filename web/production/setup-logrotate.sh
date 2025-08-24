#!/bin/sh

# ログローテーション設定スクリプト（本番環境用）

echo "Setting up log rotation..."

# logrotateの設定確認
if [ -f /etc/logrotate.d/nginx ]; then
    echo "✓ Nginx logrotate configuration found"
else
    echo "✗ Nginx logrotate configuration not found"
    exit 1
fi

# cronジョブの追加（毎日午前2時にログローテーション実行）
echo "0 2 * * * /usr/sbin/logrotate /etc/logrotate.d/nginx" >> /var/spool/cron/crontabs/root

# cronサービスの起動
if command -v crond >/dev/null 2>&1; then
    crond -f -d 8 &
    echo "✓ Cron service started"
else
    echo "⚠ Cron service not available"
fi

echo "Log rotation setup completed"
