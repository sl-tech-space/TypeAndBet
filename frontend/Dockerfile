FROM node:20-slim

WORKDIR /app

# システム依存関係のインストール
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# パッケージファイルをコピー
COPY package.json yarn.lock ./

# 依存関係のインストール
RUN yarn install --frozen-lockfile

# ソースコードをコピー
COPY . .

# ビルド時の環境変数
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_WEBPACK_POLLING=1000
ENV NEXT_TURBO_POLL=1000

# メモリ最適化設定
ENV NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=128"

# ガベージコレクション最適化
ENV UV_THREADPOOL_SIZE=4
ENV NODE_MAX_OLD_SPACE_SIZE=2048

# 開発サーバーのポート
EXPOSE 3000

# 開発サーバーを起動
# cross-envがない場合に備えてインストールしてから起動
CMD ["sh", "-c", "yarn install --frozen-lockfile && yarn dev"]
