FROM python:3.11-slim

# システムの依存関係をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txtを先にコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY . .

# 開発サーバーを実行
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]