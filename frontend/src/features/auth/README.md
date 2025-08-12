# 🔐 認証機能 (Auth)

ユーザー認証に関する機能を提供するモジュールです。

## 📁 ディレクトリ構造

```
auth/
├── components/               # UIコンポーネント
│   ├── AuthActions/         # 認証アクション切り替え
│   ├── AuthCard/            # 認証フォームカード
│   ├── login/
│   │   └── LoginForm/       # ログインフォーム
│   ├── oauth/
│   │   └── GoogleAuth/      # Google認証ボタン
│   ├── signup/
│   │   └── SignupForm/      # サインアップフォーム
│   └── index.ts
├── hooks/                   # カスタムフック
│   ├── useAuthPath.ts       # 認証パス管理
│   ├── useLogin.ts          # ログイン処理
│   ├── useLogin.types.ts    # ログイン型定義
│   ├── usePasswordVisibility.ts  # パスワード表示制御
│   ├── useSignup.ts         # サインアップ処理
│   ├── useSignup.types.ts   # サインアップ型定義
│   ├── useValidation.ts     # フォームバリデーション
│   └── index.ts
├── index.ts
└── README.md
```

## 🌟 機能概要

- **メール認証**: メールアドレスとパスワードによる認証
- **Google OAuth**: Googleアカウントでのソーシャル認証
- **セッション管理**: NextAuth.jsによる安全なセッション管理
- **フォームバリデーション**: リアルタイムバリデーション機能
- **認証状態管理**: アプリケーション全体での認証状態の一元管理

## 🧩 主要コンポーネント

- **AuthCard**: 認証フォームの共通カードレイアウト
- **LoginForm**: ログイン用フォームコンポーネント
- **SignupForm**: サインアップ用フォームコンポーネント
- **GoogleAuth**: Google OAuth認証ボタン
- **AuthActions**: ログイン/サインアップの切り替えアクション

## 🎣 主要フック

- **useLogin**: ログイン機能を提供
- **useSignup**: サインアップ機能を提供
- **useValidation**: フォームのバリデーション機能
- **usePasswordVisibility**: パスワードの表示/非表示制御
- **useAuthPath**: 認証関連のパス管理

## 🔧 バリデーションルール

### パスワード要件

- 8文字以上50文字以下
- 大文字2文字以上含む
- 小文字必須
- 数字2文字以上含む
- 特殊文字1文字以上含む

### メールアドレス要件

- RFC5322準拠
- 最大254文字

### ユーザー名要件

- 2文字以上20文字以下

## 🔗 関連機能

- セッション管理: `@/hooks/session`
- ナビゲーション: `@/hooks/routing`
- API通信: `@/actions/auth`
