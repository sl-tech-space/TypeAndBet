# 認証機能

このディレクトリには、アプリケーションの認証に関する機能をまとめています。

## 概要

- ユーザー認証機能の実装
- Google 認証を含む各種認証方式の実装
- 認証状態の管理
- 認証に関連するユーティリティ

## 特徴

- Google 認証はアプリケーション内の重要な認証機能として、このディレクトリで実装
- セキュアな認証フローの提供
- 他の認証方式との統合的な管理

## ディレクトリ構成

```
auth/
├── components/          # 認証関連のUIコンポーネント
│   ├── AuthActions/    # 認証アクション（ログイン/サインアップ切り替えなど）
│   ├── AuthCard/       # 認証フォームのカードコンポーネント
│   ├── login/         # ログイン関連のコンポーネント
│   ├── oauth/         # OAuth認証（Google認証など）のコンポーネント
│   └── signup/        # サインアップ関連のコンポーネント
│
├── hooks/              # 認証関連のカスタムフック
│   ├── useAuthPath.ts        # 認証パスの管理
│   ├── useLogin.ts          # ログイン機能
│   ├── useLogin.types.ts    # ログイン関連の型定義
│   ├── usePasswordVisibility.ts  # パスワード表示制御
│   ├── useSignup.ts         # サインアップ機能
│   ├── useSignup.types.ts   # サインアップ関連の型定義
│   └── useValidation.ts     # フォームバリデーション
│
└── index.ts           # 機能のエクスポート
```

## 主要コンポーネント

### コンポーネント

- **AuthCard**: 認証フォームを表示するカードコンポーネント
- **AuthActions**: ログイン/サインアップの切り替えなどのアクション
- **Login**: ログインフォームコンポーネント
- **Signup**: サインアップフォームコンポーネント
- **OAuth**: Google 認証などの OAuth 関連コンポーネント

### カスタムフック

- **useLogin**: ログイン機能を提供
- **useSignup**: サインアップ機能を提供
- **useValidation**: フォームのバリデーション機能
- **usePasswordVisibility**: パスワードの表示/非表示制御
- **useAuthPath**: 認証関連のパス管理

## 使用方法

各コンポーネントやフックは、アプリケーション内で以下のように使用できます：

```tsx
import { useLogin, useSignup, AuthCard } from "@/features/auth";

// ログインフック
const { login, isLoading } = useLogin();

// サインアップフック
const { signup, isLoading } = useSignup();

// 認証カード
<AuthCard title="ログイン">{/* フォームコンポーネント */}</AuthCard>;
```
