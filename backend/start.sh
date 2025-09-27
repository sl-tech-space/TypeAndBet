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
        log "Database connection failed after 60 attempts"
        log "Environment variables:"
        log "DB_HOST: $DB_HOST"
        log "DB_PORT: $DB_PORT"
        log "DB_USER: $DB_USER"
        log "DB_NAME: $DB_NAME"
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

# Pythonスケジューラーをバックグラウンドで起動
log "Starting Python scheduler..."
python scheduler.py &
SCHEDULER_PID=$!

# Gunicorn起動
log "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers $(( $(nproc) * 2 + 1 )) \
    --worker-class sync \
    --worker-connections 1000 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --timeout 30 \
    --keep-alive 2 \
    --access-logfile /app/logs/access.log \
    --error-logfile /app/logs/error.log \
    --log-level info \
    --preload \
    --capture-output \
    --enable-stdio-inheritance
