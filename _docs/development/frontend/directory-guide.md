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
│   ├── styles/       # グローバルスタイルと変数
│   └── __tests__/    # テストセットアップとグローバルテスト設定
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

静的ファイル（画像、フォント、favicon.ico、ロボットテキストファイルなど）を格納するディレクトリです。このディレクトリ内のファイルはルート URL から直接アクセス可能です。

#### `.next/`

Next.js のビルド出力先です。自動生成されるため、バージョン管理から除外されています。

### ソースコードのディレクトリ（src/以下）

#### `app/`

Next.js の App Router を使用したページコンポーネントを配置するディレクトリです。ルーティング構造に合わせたディレクトリ階層になっています。

#### `components/`

再利用可能な React コンポーネントを格納するディレクトリです。3 つのサブディレクトリに分類されています：

- **`ui/`**: アプリ全体で再利用される汎用的な UI コンポーネント（ボタン、テキスト、フォーム要素、アイコンなど）
- **`layouts/`**: ページのレイアウトを構成するコンポーネント（ヘッダー、フッター、バックグラウンドなど）
- **`common/`**: アプリ全体で使用される共通機能コンポーネント（Supporter など）

#### `components/common/`

アプリ全体で使用される共通の機能コンポーネントを格納するディレクトリです：

- **`Supporter/`**: ユーザーをサポートするキャラクターコンポーネント。画面右下に固定表示され、メッセージの表示やページトップへのスクロール機能を提供します。
- **`context/`**: React コンテキスト（MessageContext など）を提供するコンポーネント群です。

#### `features/`

特定の機能に関連するコードをまとめたディレクトリです。各機能は独自のディレクトリを持ち、その中に関連するコンポーネント、フック、型定義などが含まれます：

- **`auth/`**: 認証関連の機能（ログイン、サインアップ、Google 認証など）
- **`helper/`**: ヘルパー機能（スクロールヘルパーなど）
- **`games/`**: ゲーム関連の機能（タイピングゲーム、モードセレクター、ゲームコンポーネントなど）
  - **`components/`**: ゲーム固有のコンポーネント（ModeSelector、GameSupporter、TypingGame など）
  - **`hooks/`**: ゲーム固有のフック（useTyping、useTimer、useGenerator、useKeydown など）
  - **`types/`**: ゲーム固有の型定義（Sentence、TextPair、GeneratorResult など）
  - **`utils/`**: ゲーム固有のユーティリティ（trieUtils など）
  - **`stores/`**: ゲーム固有の状態管理（useTimerStore など）
  - **`contexts/`**: ゲーム固有のコンテキスト（TypingContext など）
- その他の機能ごとのディレクトリ

各機能ディレクトリの内部構造は以下のようになります：

```
features/games/
├── components/      # 機能固有のコンポーネント（ModeSelector、GameSupporter、TypingGameなど）
├── hooks/           # 機能固有のフック（useTyping、useTimer、useGenerator、useKeydownなど）
├── types/           # 機能固有の型定義（Sentence、TextPair、GeneratorResultなど）
├── utils/           # 機能固有のユーティリティ（trieUtilsなど）
├── stores/          # 機能固有の状態管理（useTimerStoreなど）
├── contexts/        # 機能固有のコンテキスト（TypingContextなど）
└── index.ts         # エクスポート用ファイル
```

#### `hooks/`

アプリケーション全体で使用される共通のカスタム React フックを格納するディレクトリです。状態管理や副作用の抽象化に使用されます。

#### `types/`

アプリケーション全体で使用される TypeScript の型定義ファイルを格納するディレクトリです。共通の型やインターフェイスが定義されています。

#### `utils/`

ヘルパー関数や汎用的なユーティリティを格納するディレクトリです。日付フォーマット、文字列操作、メタデータ作成などの関数が含まれます。

#### `constants/`

アプリケーション全体で使用される定数を定義するディレクトリです。API URL、ルート定義、メッセージなどが含まれます。

#### `styles/`

グローバルスタイルと Sass の変数やミックスインを格納するディレクトリです：

- **`variables.scss`**: アプリケーション全体で使用される Sass 変数（色、フォント、サイズなど）
- **`animations.scss`**: アプリケーション全体で使用されるアニメーション定義

#### `__tests__/`

テストセットアップとグローバルテスト設定を格納するディレクトリです：

- **`setup.ts`**: Vitest のグローバルセットアップファイル。window オブジェクトのモックやグローバルテストユーティリティを提供します。

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

## テストの構造

テストファイルは各コンポーネントやフックと同じディレクトリに配置され、以下の命名規則に従います：

```
ComponentName.test.ts          # コンポーネントのテスト
useHookName.test.ts           # フックのテスト
utilsName.test.ts             # ユーティリティのテスト
```

テストの説明は日本語で記述し、テストの意図を明確にします。例：

```typescript
it("初期状態を返すこと", () => {
  // テスト内容
});

it("タイピング入力を正しく処理すること", () => {
  // テスト内容
});
```

## コンテキストの利用

アプリケーション全体で状態を共有するために、React コンテキストを使用しています：

```
components/common/context/MessageContext.tsx
```

このコンテキストは、アプリケーション内でのメッセージ共有に利用されています。例えば、`Supporter`コンポーネントは`useMessage`フックを使用して、他のコンポーネントからのメッセージを表示します。

```typescript
// コンテキストの使用例
const { message, setMessage } = useMessage();
```

## 状態管理

アプリケーションでは以下の状態管理手法を使用しています：

- **React Hooks**: ローカル状態管理（useState、useReducer）
- **React Context**: アプリケーション全体での状態共有
- **Zustand**: 複雑な状態管理（useTimerStore など）
- **カスタムフック**: ビジネスロジックの抽象化（useTyping、useGenerator など）

## 命名規則

- **ファイル名**: PascalCase (例: `Button.tsx`, `UserProfile.tsx`)
- **コンポーネント名**: PascalCase (例: `Button`, `UserProfile`)
- **ユーティリティ関数**: camelCase (例: `formatDate.ts`, `validateEmail.ts`)
- **フック**: use + PascalCase (例: `useAuth.ts`, `useForm.ts`)
- **型定義**: PascalCase + Props/Type/Interface (例: `ButtonProps`, `UserType`)
- **SCSS クラス**: Sass では基本的に BEM 記法を使用 (例: `button__icon`, `card--primary`)
- **テストファイル**: テスト対象のファイル名 + `.test.ts` (例: `Button.test.ts`, `useTyping.test.ts`)

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
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 内部モジュール
import { API_URL } from "@/constants/api";

// コンポーネント (index.tsによる省略インポート)
import { Button } from "@/components/ui/Button";
// または
import { Button } from "@/components/ui";

// フック (index.tsによる省略インポート)
import { useAuth } from "@/features/auth/hooks";
// または
import { useAuth } from "@/features/auth";

// ユーティリティ
import { formatDate } from "@/utils/date";
// または
import { formatDate } from "@/utils";

// 型
import type { UserProps } from "@/types/user";

// スタイル
import styles from "./Component.module.scss";
```

各ディレクトリには `index.ts` ファイルを配置し、そのディレクトリからエクスポートするアイテムをまとめることを推奨します。これにより、インポートパスを簡潔にし、コードの可読性を向上させることができます。

例えば:

```typescript
// components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
// ...

// features/auth/index.ts
export { LoginForm } from "./components/LoginForm";
export { useAuth } from "./hooks/useAuth";
// ...
```

上記のような `index.ts` ファイルを使用することで、次のようにインポートが簡潔になります：

```typescript
// 個別指定の場合
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

// index.tsを使った場合
import { Button } from "@/components/ui";
import { useAuth, LoginForm } from "@/features/auth";
```

## テストのベストプラクティス

テストでは以下のベストプラクティスを適用しています：

1. **日本語のテスト説明**: テストの意図を明確にするため、日本語で記述
2. **適切なモック**: 外部依存関係は適切にモック化
3. **グローバルセットアップ**: `__tests__/setup.ts`で共通のテスト環境を設定
4. **型安全性**: TypeScript の型チェックを活用したテスト

## 機能ディレクトリの README

各機能ディレクトリには、その機能の概要や使用方法を説明する README.md を配置することを推奨します。
これにより、新しいチームメンバーが素早くコードを理解できるようになります。

例：

```
features/auth/README.md
features/games/README.md
```

## 補足情報

- このプロジェクトは Next.js 15 を使用しています
- TypeScript を採用し、型安全性を確保しています
- CSS モジュールと Sass を使用してスタイルを管理しています
- ESLint と TypeScript の厳格なルールを適用しています
- Vitest を使用したテスト環境を構築しています
- テストの説明は日本語で記述し、可読性を向上させています
