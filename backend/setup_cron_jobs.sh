#!/bin/bash

# TypeAndBet Django管理コマンド用のcronジョブ設定
# このスクリプトはDockerコンテナ内で実行されることを想定

DJANGO_PROJECT_DIR="/app"

# 環境に応じてPythonパスを設定
if [ "$DJANGO_ENV" = "production" ]; then
    PYTHON_PATH="/opt/venv/bin/python"
else
    PYTHON_PATH="/usr/local/bin/python"
fi

MANAGE_PY="$DJANGO_PROJECT_DIR/manage.py"

echo "cronジョブを設定します..."
echo "環境: $DJANGO_ENV"
echo "Pythonパス: $PYTHON_PATH"

# 既存のcronジョブをクリア
crontab -r 2>/dev/null || true

# cronジョブを設定
echo "# TypeAndBet Django Jobs" | crontab -

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
EOF

# ①AIAPIジョブ: 10分に1回 (0,10,20,30,40,50分)
(crontab -l; echo "0,10,20,30,40,50 * * * * . /tmp/django_env && cd $DJANGO_PROJECT_DIR && $PYTHON_PATH $MANAGE_PY generate_text_job >> /var/log/generate_text_job.log 2>&1") | crontab -

# ②ひらがな変換ジョブ: 10分に1回 (5,15,25,35,45,55分)
(crontab -l; echo "5,15,25,35,45,55 * * * * . /tmp/django_env && cd $DJANGO_PROJECT_DIR && $PYTHON_PATH $MANAGE_PY convert_hiragana_job >> /var/log/convert_hiragana_job.log 2>&1") | crontab -

# ③パーティション管理ジョブ: 毎日午前2時に実行
(crontab -l; echo "0 2 * * * . /tmp/django_env && cd $DJANGO_PROJECT_DIR && $PYTHON_PATH $MANAGE_PY partition_textpairs --all >> /var/log/partition_textpairs.log 2>&1") | crontab -

echo "cronジョブの設定が完了しました"
echo "設定されたcronジョブ:"
crontab -l

# ログファイルを事前に作成（権限を適切に設定）
echo "ログファイル作成中..."
touch /var/log/generate_text_job.log
touch /var/log/convert_hiragana_job.log
touch /var/log/partition_textpairs.log

# ログファイルの権限を確認
echo "ログファイルの権限を確認中..."
ls -la /var/log/*.log 2>/dev/null || echo "ログファイルが見つかりません"

# cronサービスを開始
echo "cronサービスを開始します..."
# PIDファイルの権限を確認
ls -la /var/run/crond.pid 2>/dev/null || echo "PIDファイルが見つかりません"

# cronサービスを起動（権限の問題を回避）
if [ -w /var/run/crond.pid ]; then
    echo "PIDファイルに書き込み権限があります"
    cron
else
    echo "PIDファイルに書き込み権限がありません。権限を修正します..."
    sudo chown $USER:$USER /var/run/crond.pid 2>/dev/null || true
    sudo chmod 755 /var/run/crond.pid 2>/dev/null || true
    cron
fi

echo "cronジョブ設定完了"

# ログファイルを監視（存在しない場合は待機）
while true; do
    if [ -f /var/log/generate_text_job.log ] && [ -f /var/log/convert_hiragana_job.log ] && [ -f /var/log/partition_textpairs.log ]; then
        echo "すべてのログファイルが作成されました。ログ監視を開始します..."
        tail -f /var/log/generate_text_job.log /var/log/convert_hiragana_job.log /var/log/partition_textpairs.log
    else
        echo "ログファイル作成中..."
        sleep 5
    fi
done
