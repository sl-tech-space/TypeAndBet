#!/bin/bash
set -euo pipefail

# ログ関数
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# エラーハンドリング
error_exit() {
    log "ERROR: $1"
    exit 1
}

# データベース接続確認
log "Checking database connection..."
for i in {1..60}; do
    if python manage.py check --database default; then
        log "Database connection established"
        break
    fi
    if [ $i -eq 60 ]; then
        error_exit "Database connection failed after 60 attempts"
    fi
    log "Waiting for database... (attempt $i/60)"
    sleep 1
done

# マイグレーション実行
log "Running migrations..."
if ! python manage.py migrate --noinput; then
    error_exit "Migration failed"
fi
log "Migrations completed successfully"

# ログディレクトリを作成
mkdir -p /app/logs

# Pythonスケジューラーをバックグラウンドで起動
log "Starting Python scheduler in background..."
python scheduler.py > /app/logs/scheduler.log 2>&1 &
SCHEDULER_PID=$!
log "Scheduler started with PID: $SCHEDULER_PID"

# Django開発サーバー起動
log "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000

