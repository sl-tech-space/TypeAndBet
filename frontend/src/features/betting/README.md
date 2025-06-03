# Betting 機能

TypeAndBet アプリケーションのベッティング機能を管理するディレクトリです。

## 機能概要

このディレクトリは、ユーザーがゲームにベットを行うための機能を提供します。主な機能は以下の通りです：

- ベット額の入力と管理
- 残高チェック
- 制限時間の計算
- ベット処理の実行
- アニメーション付きの残高表示

## ディレクトリ構造

```
betting/
├── README.md
├── components/
│   ├── GoldBetCard/
│   │   ├── GoldBetForm/
│   │   │   ├── GoldBetForm.tsx
│   │   │   ├── GoldBetForm.types.ts
│   │   │   └── index.ts
│   │   ├── GoldBetCard.tsx
│   │   ├── GoldBetCard.types.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── betting.types.ts
│   ├── useBetting.ts
│   └── index.ts
└── index.ts
```

## コンポーネント

### GoldBetCard

ベッティング機能のメインコンポーネントです。以下の機能を提供します：

- ベット額の入力フォーム
- 残高表示
- ベット実行ボタン
- エラー表示

#### Props

```typescript
{
  onBet?: (amount: number) => Promise<{ success: boolean; error?: string }>;
  balance: number;
  isLoading?: boolean;
  minBet?: number;
  maxBet?: number;
  gameModeId: string;
}
```

## カスタムフック

### useBetting

ベッティング機能の中核となるカスタムフックです。以下の機能を提供します：

- ベット額の状態管理
- 制限時間の計算
- 残高チェック
- エラー処理
- アニメーション付きの残高更新

#### Props

```typescript
{
  onBet?: (amount: number) => Promise<{ success: boolean; error?: string }>;
  balance: number;
  minBet?: number;
  maxBet?: number;
  gameModeId: string;
}
```

#### 戻り値

```typescript
{
  betAmount: number;
  setBetAmount: (amount: number) => void;
  timeLimit: number;
  isSubmitting: boolean;
  isExceedingBalance: boolean;
  error: string | null;
  handleBet: () => Promise<void>;
  handleCancel: () => void;
  displayBalance: number;
}
```

## 使用例

```tsx
import { GoldBetCard } from "@/features/betting";

const GamePage = () => {
  const handleBet = async (amount: number) => {
    // ベット処理の実装
    return { success: true };
  };

  return <GoldBetCard balance={1000} onBet={handleBet} gameModeId="REAL" />;
};
```

## 制限事項

- ベット額は最小ベット額（デフォルト値あり）以上、最大ベット額（デフォルト値あり）以下である必要があります
- ベット額は現在の残高を超えることはできません
- シミュレートモード（gameModeId: "SIMULATE"）の場合、実際のベット処理は行われず、タイピング画面に遷移します
