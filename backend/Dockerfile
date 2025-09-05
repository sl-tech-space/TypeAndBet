FROM python:3.11-slim

# システムの依存関係をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    cron \
    mecab \
    mecab-ipadic-utf8 \
    && rm -rf /var/lib/apt/lists/*

# cronジョブ用のユーザーを作成
RUN useradd -m -s /bin/bash cronuser && \
    mkdir -p /var/log && \
    chown -R cronuser:cronuser /var/log && \
    chmod 755 /var/log

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txtを先にコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY . .

# cronジョブ設定スクリプトに実行権限を付与
RUN chmod +x setup_cron_jobs_prod.sh

# ログディレクトリを作成
RUN mkdir -p /var/log

# MeCab設定ファイルのシンボリックリンクを作成
RUN mkdir -p /usr/local/etc && ln -sf /etc/mecabrc /usr/local/etc/mecabrc

# 開発サーバーを実行
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
