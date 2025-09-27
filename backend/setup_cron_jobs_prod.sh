#!/bin/bash

# TypeAndBet Django管理コマンド用のcronジョブ設定（簡素化版）
# このスクリプトはDockerコンテナ内でrootユーザーで実行されることを想定

set -euo pipefail

# ログ関数
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

log "cronジョブスケジューラーを開始します..."
log "環境: $DJANGO_ENV"

# 環境変数ファイルを作成
cat > /tmp/django_env << EOF
export DJANGO_ENV=$DJANGO_ENV
export DEBUG=$DEBUG
export SECRET_KEY="$SECRET_KEY"
export TZ=$TZ
export DB_HOST=$DB_HOST
export DB_PORT=$DB_PORT
export DB_USER=$DB_USER
export DB_PASSWORD=$DB_PASSWORD
export DB_NAME=$DB_NAME
export JWT_SECRET=$JWT_SECRET
export PYTHONIOENCODING=$PYTHONIOENCODING
export GEMINI_API_KEY=$GEMINI_API_KEY
export GEMINI_MODEL=$GEMINI_MODEL
export PATH="/opt/venv/bin:$PATH"
EOF

# cron設定ファイルを作成
log "cronジョブを設定します..."
cat > /etc/cron.d/typeandbet << EOF
# TypeAndBet Django Jobs
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0,10,20,30,40,50 * * * * root . /tmp/django_env && cd /app && /opt/venv/bin/python /app/manage.py generate_text_job >> /app/logs/generate_text_job.log 2>&1
5,15,25,35,45,55 * * * * root . /tmp/django_env && cd /app && /opt/venv/bin/python /app/manage.py convert_hiragana_job >> /app/logs/convert_hiragana_job.log 2>&1
0 2 * * * root . /tmp/django_env && cd /app && /opt/venv/bin/python /app/manage.py partition_textpairs --all >> /app/logs/partition_textpairs.log 2>&1
EOF

# cron設定ファイルの権限を設定
chmod 0644 /etc/cron.d/typeandbet

# ログファイルを事前に作成
touch /app/logs/generate_text_job.log
touch /app/logs/convert_hiragana_job.log
touch /app/logs/partition_textpairs.log
chown django:django /app/logs/*.log

log "cronジョブの設定が完了しました"

# cronサービスを開始
log "cronサービスを開始します..."

# 環境変数を設定
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# cronディレクトリの権限を確認・修正
chmod 755 /var/spool/cron
chmod 755 /var/spool/cron/crontabs
chmod 644 /etc/cron.d/typeandbet

# RHEL/CentOS対応: crondサービスを起動
log "crondサービスを起動中..."

# システムサービスとしてcrondを起動（RHEL/CentOS対応）
if command -v systemctl >/dev/null 2>&1; then
    # systemctlが利用可能な場合（systemd環境）
    log "systemctlを使用してcrondを起動します"
    systemctl start crond
    systemctl enable crond
    sleep 2
    if systemctl is-active --quiet crond; then
        log "crondサービスが正常に起動しました"
    else
        log "ERROR: crondサービスの起動に失敗しました"
        systemctl status crond
        exit 1
    fi
else
    # systemctlが利用できない場合（Dockerコンテナなど）
    log "直接crondプロセスを起動します"
    # RHEL系ではcrondコマンドを使用
    if command -v crond >/dev/null 2>&1; then
        crond -f -d 8 &
        CRON_CMD="crond"
    else
        # フォールバック: cronコマンドを使用
        cron &
        CRON_CMD="cron"
    fi

    sleep 2
    if pgrep $CRON_CMD > /dev/null; then
        log "$CRON_CMDプロセスが正常に起動しました (PID: $(pgrep $CRON_CMD))"
    else
        log "ERROR: $CRON_CMDプロセスの起動に失敗しました"
        exit 1
    fi
fi

log "cronジョブ設定完了"

# RHEL環境でのcronログ確認
log "cron設定とプロセス状況を確認します..."
log "cron設定ファイルの内容:"
cat /etc/cron.d/typeandbet

log "実行中のcronプロセス:"
ps aux | grep -E "(cron|crond)" | grep -v grep

# RHEL系のcronログがあるか確認
if [ -f /var/log/cron ]; then
    log "RHEL系cronログを確認します:"
    tail -5 /var/log/cron
else
    log "RHEL系cronログファイルが見つかりません"
fi

# ログ監視
log "ログ監視を開始します..."
tail -f /app/logs/generate_text_job.log /app/logs/convert_hiragana_job.log /app/logs/partition_textpairs.log
