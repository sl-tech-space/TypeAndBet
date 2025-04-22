# フロントエンド ディレクトリガイド

このドキュメントでは、フロントエンドのディレクトリ構造と各ディレクトリの役割について説明します。

## ディレクトリ構造の概要

```
frontend/
├── .next/            # Next.jsのビルド出力先
├── src/              # ソースコード
│   ├── app/          # Next.jsのアプリケーションルーティング
│   ├── components/   # Reactコンポーネント
│   │   ├── ui/       # 汎用UIコンポーネント
│   │   ├── layouts/  # レイアウトコンポーネント
│   │   └── common/   # 共通機能コンポーネント
│   ├── features/     # 機能ごとのコード
│   │   ├── auth/     # 認証機能
│   │   ├── helper/   # ヘルパー機能
│   │   ├── games/    # ゲーム関連機能
│   │   └── ...       # その他の機能
│   ├── hooks/        # 共通カスタムReactフック
│   ├── types/        # TypeScript型定義
│   ├── utils/        # ユーティリティ関数
│   ├── constants/    # 定数定義
│   └── styles/       # グローバルスタイルと変数
├── public/           # 静的アセット（画像、フォントなど）
│   └── assets/       # 画像やアイコンなどのアセット
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
静的ファイル（画像、フォント、favicon.ico、ロボットテキストファイルなど）を格納するディレクトリです。このディレクトリ内のファイルはルートURLから直接アクセス可能です。

#### `.next/`
Next.jsのビルド出力先です。自動生成されるため、バージョン管理から除外されています。

### ソースコードのディレクトリ（src/以下）

#### `app/`
Next.jsのApp Routerを使用したページコンポーネントを配置するディレクトリです。ルーティング構造に合わせたディレクトリ階層になっています。

#### `components/`
再利用可能なReactコンポーネントを格納するディレクトリです。3つのサブディレクトリに分類されています：

- **`ui/`**: アプリ全体で再利用される汎用的なUIコンポーネント（ボタン、テキスト、フォーム要素、アイコンなど）
- **`layouts/`**: ページのレイアウトを構成するコンポーネント（ヘッダー、フッター、バックグラウンドなど）
- **`common/`**: アプリ全体で使用される共通機能コンポーネント（Supporterなど）

#### `components/common/`
アプリ全体で使用される共通の機能コンポーネントを格納するディレクトリです：

- **`Supporter/`**: ユーザーをサポートするキャラクターコンポーネント。画面右下に固定表示され、メッセージの表示やページトップへのスクロール機能を提供します。
- **`context/`**: Reactコンテキスト（MessageContextなど）を提供するコンポーネント群です。

#### `features/`
特定の機能に関連するコードをまとめたディレクトリです。各機能は独自のディレクトリを持ち、その中に関連するコンポーネント、フック、型定義などが含まれます：

- **`auth/`**: 認証関連の機能（ログイン、サインアップ、Google認証など）
- **`helper/`**: ヘルパー機能（スクロールヘルパーなど）
- **`games/`**: ゲーム関連の機能（モードセレクター、ゲームコンポーネントなど）
- その他の機能ごとのディレクトリ

各機能ディレクトリの内部構造は以下のようになります：
```
features/games/
├── components/      # 機能固有のコンポーネント（ModeSelector、GameSupporterなど）
├── hooks/           # 機能固有のフック（useGameModeなど）
├── types/           # 機能固有の型定義
├── utils/           # 機能固有のユーティリティ
└── index.ts         # エクスポート用ファイル
```

#### `hooks/`
アプリケーション全体で使用される共通のカスタムReactフックを格納するディレクトリです。状態管理や副作用の抽象化に使用されます。

#### `types/`
アプリケーション全体で使用されるTypeScriptの型定義ファイルを格納するディレクトリです。共通の型やインターフェイスが定義されています。

#### `utils/`
ヘルパー関数や汎用的なユーティリティを格納するディレクトリです。日付フォーマット、文字列操作、メタデータ作成などの関数が含まれます。

#### `constants/`
アプリケーション全体で使用される定数を定義するディレクトリです。API URL、ルート定義、メッセージなどが含まれます。

#### `styles/`
グローバルスタイルとSassの変数やミックスインを格納するディレクトリです。

## コンポーネントの構造

各コンポーネントは以下の構造に従って編成されています：

```
components/ui/Button/
├── index.ts              # エクスポート用ファイル
├── Button.tsx            # コンポーネント実装
├── Button.types.ts       # 型定義（オプション）
└── Button.module.scss    # スタイル
```

機能ディレクトリ内のコンポーネントも同様の構造に従います：

```
features/games/components/ModeSelector/
├── index.ts                  # エクスポート用ファイル
├── ModeSelector.tsx          # コンポーネント実装
├── ModeSelector.types.ts     # 型定義（オプション）
└── ModeSelector.module.scss  # スタイル
```

## コンテキストの利用

アプリケーション全体で状態を共有するために、Reactコンテキストを使用しています：

```
components/common/context/MessageContext.tsx
```

このコンテキストは、アプリケーション内でのメッセージ共有に利用されています。例えば、`Supporter`コンポーネントは`useMessage`フックを使用して、他のコンポーネントからのメッセージを表示します。

```typescript
// コンテキストの使用例
const { message, setMessage } = useMessage();
```

## 命名規則

* **ファイル名**: PascalCase (例: `Button.tsx`, `UserProfile.tsx`)
* **コンポーネント名**: PascalCase (例: `Button`, `UserProfile`)
* **ユーティリティ関数**: camelCase (例: `formatDate.ts`, `validateEmail.ts`)
* **フック**: use + PascalCase (例: `useAuth.ts`, `useForm.ts`)
* **型定義**: PascalCase + Props/Type/Interface (例: `ButtonProps`, `UserType`)
* **SCSSクラス**: Sassでは基本的にBEM記法を使用 (例: `button__icon`, `card--primary`)

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
import { useRouter } from 'next/navigation';

// 内部モジュール
import { API_URL } from '@/constants/api';

// コンポーネント (index.tsによる省略インポート)
import { Button } from '@/components/ui/Button';
// または
import { Button } from '@/components/ui';

// フック (index.tsによる省略インポート)
import { useAuth } from '@/features/auth/hooks';
// または
import { useAuth } from '@/features/auth';

// ユーティリティ
import { formatDate } from '@/utils/date';
// または
import { formatDate } from '@/utils';

// 型
import type { UserProps } from '@/types/user';

// スタイル
import styles from './Component.module.scss';
```

各ディレクトリには `index.ts` ファイルを配置し、そのディレクトリからエクスポートするアイテムをまとめることを推奨します。これにより、インポートパスを簡潔にし、コードの可読性を向上させることができます。

例えば:

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
// ...

// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
// ...
```

上記のような `index.ts` ファイルを使用することで、次のようにインポートが簡潔になります：

```typescript
// 個別指定の場合
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';

// index.tsを使った場合
import { Button } from '@/components/ui';
import { useAuth, LoginForm } from '@/features/auth';
```

## 機能ディレクトリのREADME

各機能ディレクトリには、その機能の概要や使用方法を説明するREADME.mdを配置することを推奨します。
これにより、新しいチームメンバーが素早くコードを理解できるようになります。

例：
```
features/auth/README.md
```

## 補足情報

* このプロジェクトはNext.js 15を使用しています
* TypeScriptを採用し、型安全性を確保しています
* CSSモジュールとSassを使用してスタイルを管理しています
* ESLintとTypeScriptの厳格なルールを適用しています