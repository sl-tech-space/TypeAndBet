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

# アプリケーションのコードをコピー
COPY . .

# 依存関係を生成してインストール
RUN pip install --quiet pip-tools && \
    python scripts/generate_requirements.py && \
    pip-compile requirements.in && \
    pip install --no-cache-dir -r requirements.txt

# 開発サーバーを実行
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]