# フロントエンド ディレクトリガイド

このドキュメントでは、フロントエンドのディレクトリ構造と各ディレクトリの役割について説明します。

## ディレクトリ構造の概要

```
frontend/
├── .next/            # Next.jsのビルド出力先
├── src/              # ソースコード
│   ├── app/          # Next.jsのアプリケーションルーティング
│   ├── components/   # Reactコンポーネント
│   │   ├── common/   # 共通コンポーネント
│   │   ├── features/ # 機能ごとのコンポーネント
│   │   └── layouts/  # レイアウトコンポーネント
│   ├── hooks/        # カスタムReactフック
│   ├── types/        # TypeScript型定義
│   ├── utils/        # ユーティリティ関数
│   ├── constants/    # 定数定義
│   └── lib/          # 外部ライブラリとの統合
├── public/           # 静的アセット（画像、フォントなど）
├── node_modules/     # 依存パッケージ
├── package.json      # パッケージ設定とスクリプト
├── yarn.lock         # 依存関係のロックファイル
├── tsconfig.json     # TypeScript設定
├── eslint.config.mjs # ESLint設定
├── next.config.ts    # Next.js設定
├── next-env.d.ts     # Next.js型定義
└── README.md         # プロジェクト概要
```

## 各ディレクトリの役割

### トップレベルディレクトリ

#### `src/`
すべてのソースコードを含むメインディレクトリです。フロントエンドの実装コードはすべてここに配置されます。

#### `public/`
静的ファイル（画像、フォント、ロボットテキストファイルなど）を格納するディレクトリです。このディレクトリ内のファイルはルートURLから直接アクセス可能です。

#### `.next/`
Next.jsのビルド出力先です。自動生成されるため、バージョン管理から除外されています。

### ソースコードのディレクトリ（src/以下）

#### `app/`
Next.jsのApp Routerを使用したページコンポーネントを配置するディレクトリです。ルーティング構造に合わせたディレクトリ階層になっています。

#### `components/`
再利用可能なReactコンポーネントを格納するディレクトリです。3つのサブディレクトリに分類されています：

- **`common/`**: アプリ全体で再利用される汎用的なコンポーネント（ボタン、テキスト、フォーム要素など）
- **`features/`**: 特定の機能に関連するコンポーネント（認証、ダッシュボード、プロフィールなど）
- **`layouts/`**: ページのレイアウトを構成するコンポーネント（ヘッダー、フッター、サイドバーなど）

#### `hooks/`
カスタムReactフックを格納するディレクトリです。状態管理や副作用の抽象化に使用されます。

#### `types/`
TypeScriptの型定義ファイルを格納するディレクトリです。共通の型やインターフェイスが定義されています。

#### `utils/`
ヘルパー関数や汎用的なユーティリティを格納するディレクトリです。日付フォーマット、文字列操作などの関数が含まれます。

#### `constants/`
アプリケーション全体で使用される定数を定義するディレクトリです。API URLやローカライズされたメッセージなどが含まれます。

#### `lib/`
サードパーティライブラリのラッパーや設定を格納するディレクトリです。APIクライアントや認証ライブラリなどの統合が含まれます。

## コンポーネントの構造

各コンポーネントは以下の構造に従って編成されています：

```
components/common/ComponentName/
├── index.ts              # エクスポート用ファイル
├── ComponentName.tsx     # コンポーネント実装
├── ComponentName.types.ts # 型定義
└── ComponentName.module.scss # スタイル
```

## 命名規則

* **ファイル名**: PascalCase (例: `Button.tsx`, `UserProfile.tsx`)
* **コンポーネント名**: PascalCase (例: `Button`, `UserProfile`)
* **ユーティリティ関数**: camelCase (例: `formatDate.ts`, `validateEmail.ts`)
* **フック**: use + PascalCase (例: `useAuth.ts`, `useForm.ts`)
* **型定義**: PascalCase + Props/Type/Interface (例: `ButtonProps`, `UserType`)

## インポートのベストプラクティス

コードの可読性と一貫性を確保するため、以下のインポート順序を推奨します：

1. 外部ライブラリとフレームワーク
2. 内部モジュール（絶対パス）
3. コンポーネント
4. フック
5. ユーティリティ
6. 型
7. スタイル

```typescript
// 外部ライブラリ
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 内部モジュール
import { API_URL } from '@/constants/api';

// コンポーネント
import { Button } from '@/components/common/Button';

// フック
import { useAuth } from '@/hooks/useAuth';

// ユーティリティ
import { formatDate } from '@/utils/date';

// 型
import type { UserProps } from '@/types/user';

// スタイル
import styles from './Component.module.scss';
```

## 補足情報

* このプロジェクトはNext.js 15.2.4を使用しています
* TypeScriptを採用し、型安全性を確保しています
* CSSモジュールを使用してスタイルのスコープを限定しています
* ESLintとTypeScriptの厳格なルールを適用しています