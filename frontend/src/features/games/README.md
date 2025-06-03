# ゲーム機能

このディレクトリには、ゲーム画面とその操作に関する機能をまとめています。

## 機能概要

このディレクトリは、タイピングゲームの中核となる機能を提供します。主な機能は以下の通りです：

- ゲームモードの選択と管理
- タイピングゲームのロジック
- 文章生成と管理
- キー入力の処理
- タイマー機能
- ゲーム状態の管理

## ディレクトリ構造

```
games/
├── README.md
├── components/
│   ├── ModeSelector/
│   ├── TimerCard/
│   ├── DetailCard/
│   └── index.ts
├── hooks/
│   ├── useGenerator.ts
│   ├── useTyping.ts
│   ├── useKeydown.ts
│   ├── useTimer.ts
│   ├── useGameMode.ts
│   ├── generator.types.ts
│   ├── typing.types.ts
│   ├── keydown.types.ts
│   └── index.ts
├── contexts/
│   └── TypingContext/
├── stores/
├── utils/
├── types/
└── index.ts
```

## コンポーネント

### ModeSelector

ゲームモード（シミュレーション/プレイ）を選択するためのコンポーネント

### TimerCard

ゲーム内の制限時間を表示・管理するコンポーネント

### DetailCard

ゲームの詳細情報（テーマ、カテゴリなど）を表示するコンポーネント

## カスタムフック

### useTyping

タイピングゲームの中核となるロジックを管理するフック

- 入力処理
- 進捗管理
- 正誤判定
- スコア計算

### useGenerator

ゲーム用の文章を生成・管理するフック

- AI による文章生成
- ローマ字変換
- 文章の状態管理

### useKeydown

キーボード入力を処理するフック

- キー入力イベントの処理
- 入力の正誤判定

### useTimer

ゲーム内のタイマーを管理するフック

- 制限時間の管理
- カウントダウン処理

### useGameMode

ゲームモードを管理するフック

- モード選択
- ルーティング制御

## 型定義

### Sentence

```typescript
interface Sentence {
  kanji: string;
  hiragana: string;
  romaji: string[][];
}
```

### RomajiProgress

```typescript
type RomajiProgress = {
  typed: string[];
  current: string;
  remaining: string[];
  inputString: string;
  isValid: boolean;
  nextChars: string[];
  shortRomaji: string[];
  missedChar: string;
  expectedChar: string;
};
```

## 使用例

```tsx
import { useTyping, useGenerator } from "@/features/games";

const GameComponent = () => {
  const {
    sentences,
    currentSentenceIndex,
    input,
    isComplete,
    handleKeydown,
    startTyping,
  } = useTyping();

  const { generate, promptDetail, isLoading } = useGenerator();

  // ゲーム開始時に文章を生成
  useEffect(() => {
    generate();
  }, []);

  return <div>{/* ゲーム画面のUI実装 */}</div>;
};
```

## 特徴

- シミュレーションモードとプレイモードの 2 つのゲームモードを提供
- AI を活用した文章生成システム
- リアルタイムの入力判定とフィードバック
- 詳細なタイピング統計（正確性、速度など）
- カスタムフックを活用した効率的な状態管理
- TypeScript による型安全な実装

## 制限事項

- 文章生成には API キーが必要です
- シミュレーションモードでは実際のベット処理は行われません
- 一度に生成できる文章の数に制限があります
