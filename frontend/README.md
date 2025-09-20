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
- **テスト**: Vitest + Testing Library

## 📁 プロジェクト構造

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router ページ
│   │   ├── auth/           # 認証関連ページ
│   │   ├── play/           # ゲームプレイページ
│   │   ├── simulate/       # シミュレーションページ
│   │   ├── result/         # 結果表示ページ
│   │   ├── ranking/        # ランキングページ
│   │   └── legal/          # 法的ページ
│   ├── components/          # 共通UIコンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   ├── layouts/        # レイアウトコンポーネント
│   │   └── common/         # 共通コンポーネント
│   ├── features/            # 機能別コンポーネント・ロジック
│   │   ├── auth/           # 認証機能
│   │   ├── betting/        # ベッティング機能
│   │   ├── games/          # ゲーム機能
│   │   ├── google/         # Google外部機能
│   │   ├── helper/         # ヘルパー機能
│   │   ├── ranking/        # ランキング機能
│   │   └── result/         # 結果機能
│   ├── hooks/              # 共通カスタムフック
│   │   ├── ui/             # UI関連フック
│   │   ├── session/        # セッション管理フック
│   │   ├── routing/        # ルーティングフック
│   │   └── common/         # 共通フック
│   ├── constants/          # 定数定義
│   ├── types/              # 型定義
│   ├── utils/              # ユーティリティ関数
│   ├── graphql/            # GraphQL関連
│   │   ├── mutations/      # GraphQLミューテーション
│   │   ├── queries/        # GraphQLクエリ
│   │   └── services/       # GraphQLサービス
│   ├── actions/            # Server Actions
│   ├── lib/                # ライブラリ・ユーティリティ
│   │   ├── actions/        # アクション関連
│   │   └── types/          # 型定義
│   ├── styles/             # グローバルスタイル
│   └── __tests__/          # テスト設定
├── public/                 # 静的ファイル
│   ├── assets/             # アセットファイル
│   └── docs/               # ドキュメント
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

## 🧪 テスト

```bash
# テスト実行
yarn test

# テスト実行（一度だけ）
yarn test:run

# テスト監視モード
yarn test:watch

# テストUI
yarn test:ui

# カバレッジ付きテスト
yarn test:coverage

# CI用テスト
yarn test:ci
```

## 🌟 主要機能

### 1. 認証システム

- メールアドレス・パスワード認証
- Google OAuth認証
- セッション管理
- パスワードリセット

### 2. タイピングゲーム

- リアルタイム入力判定
- AI文章生成
- 正確率・速度計測
- 複数ゲームモード

### 3. ベッティングシステム

- ゴールドを使用したベット
- 制限時間計算
- 残高管理
- リスク管理

### 4. 結果表示・ランキング

- スコア・ランキング表示
- ゲーム履歴管理
- ユーザーランキング
- 統計情報

### 5. シミュレーション機能

- ゲーム結果のシミュレーション
- 戦略検証
- パフォーマンス分析

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

### テスト戦略

- **ユニットテスト**: カスタムフック、ユーティリティ関数
- **コンポーネントテスト**: UIコンポーネントの動作確認
- **統合テスト**: 機能間の連携確認
- **カバレッジ**: 80%以上のテストカバレッジを目標

## 🔧 環境変数

以下の環境変数を設定してください：

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GRAPHQL_ENDPOINT=your_graphql_endpoint
```

## 🚀 CI/CD

### GitHub Actions

- **フロントエンドテスト**: `frontend-vitest.yml`
- **セキュリティスキャン**: `dev-security-scan.yml`
- **自動テスト実行**: プッシュ・プルリクエスト時
- **セキュリティチェック**: 毎週定期実行

### セキュリティ

- **Trivy**: 脆弱性スキャン
- **依存関係チェック**: フロントエンド・バックエンド両方
- **Dockerイメージスキャン**: ベースイメージの脆弱性チェック

## 📚 関連ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 コントリビューション

1. 開発ブランチからfeatureブランチを作成
2. 変更を実装
3. テストとlintチェックを実行
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは **Personal Use License（個人利用ライセンス）** です。
