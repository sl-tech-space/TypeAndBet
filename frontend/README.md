# TypeAndBet Frontend

TypeAndBetプロジェクトのフロントエンド部分です。Next.js 15 App Routerを使用したタイピングゲームアプリケーションです。

## 🚀 技術スタック

- **Framework**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: SCSS (BEM記法)
- **状態管理**: Zustand, React Context
- **API**: GraphQL (Apollo Client)
- **認証**: NextAuth.js
- **パッケージマネージャー**: Yarn

## 📁 プロジェクト構造

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router ページ
│   ├── components/          # 共通UIコンポーネント
│   ├── features/            # 機能別コンポーネント・ロジック
│   │   ├── auth/           # 認証機能
│   │   ├── betting/        # ベッティング機能
│   │   ├── games/          # ゲーム機能
│   │   ├── google/         # Google外部機能
│   │   ├── helper/         # ヘルパー機能
│   │   └── result/         # 結果機能
│   ├── hooks/              # 共通カスタムフック
│   ├── constants/          # 定数定義
│   ├── types/              # 型定義
│   ├── utils/              # ユーティリティ関数
│   ├── graphql/            # GraphQL関連
│   ├── actions/            # Server Actions
│   └── styles/             # グローバルスタイル
├── public/                 # 静的ファイル
└── package.json
```

## 🏃‍♂️ 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- Yarn

### インストール・起動

```bash
# 依存関係のインストール
yarn install

# 開発サーバーの起動
yarn dev

# 本番ビルド
yarn build

# 本番サーバーの起動
yarn start
```

## 🧪 コード品質管理

```bash
# ESLintチェック
yarn lint
yarn lint:all
yarn lint:fix

# TypeScriptチェック
yarn type-check

# Prettierフォーマット
yarn format
yarn format:check

# 全体チェック
yarn check:all
```

## 🌟 主要機能

### 1. 認証システム

- メールアドレス・パスワード認証
- Google OAuth認証
- セッション管理

### 2. タイピングゲーム

- リアルタイム入力判定
- AI文章生成
- 正確率・速度計測

### 3. ベッティングシステム

- ゴールドを使用したベット
- 制限時間計算
- 残高管理

### 4. 結果表示

- スコア・ランキング表示
- ゲーム履歴管理

## 📝 開発ガイドライン

### コーディング規約

- **命名規則**: キャメルケース（関数・変数）、パスカルケース（コンポーネント・型）
- **ファイル構成**: 各ディレクトリに`index.ts`を配置し、適切にエクスポート
- **スタイル**: SCSS + BEM記法、レスポンシブ対応
- **型安全性**: TypeScriptの厳格な型チェックを使用

### コンポーネント設計

```typescript
// 推奨パターン
export const ComponentName = ({ prop1, prop2 }: ComponentProps): ReactElement => {
  // ロジック
  return <div className={styles["component-name"]}>{/* JSX */}</div>;
};
```

### API呼び出し

- Server ActionsとGraphQLを使用
- 適切なエラーハンドリング
- 統一されたレスポンス形式

## 🔧 環境変数

以下の環境変数を設定してください：

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GRAPHQL_ENDPOINT=your_graphql_endpoint
```

## 📚 関連ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

## 🤝 コントリビューション

1. 開発ブランチからfeatureブランチを作成
2. 変更を実装
3. テストとlintチェックを実行
4. プルリクエストを作成
