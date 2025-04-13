FROM node:20-slim

WORKDIR /app

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

# 開発サーバーのポート
EXPOSE 3000

# 開発サーバーを起動
CMD ["yarn", "dev"]
