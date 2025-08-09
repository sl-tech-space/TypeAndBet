# 🎮 ゲーム機能 (Games)

タイピングゲームの中核となる機能を提供するモジュールです。

## 📁 ディレクトリ構造

```
games/
├── components/
│   ├── DetailCard/          # ゲーム詳細表示
│   ├── ModeSelector/        # モード選択
│   ├── TimerCard/           # タイマー表示
│   │   └── Timer/           # タイマー本体
│   ├── TypingCard/          # タイピング画面
│   │   ├── InputKeyboard/   # キーボード表示
│   │   └── SentenceDisplay/ # 文章表示
│   └── index.ts
├── contexts/
│   └── TypingContext.tsx    # タイピング状態管理
├── hooks/
│   ├── useGenerator.ts      # 文章生成
│   ├── useKeydown.ts        # キー入力処理
│   ├── useTimer.ts          # タイマー管理
│   ├── useTyping.ts         # タイピング統合
│   ├── generator.types.ts   # 生成関連型
│   ├── keydown.types.ts     # キー入力型
│   ├── typing.types.ts      # タイピング型
│   └── index.ts
├── stores/
│   └── timerStore.ts        # タイマー状態
├── types/
│   └── games.ts             # ゲーム型定義
├── utils/
│   └── trieUtils.ts         # Trie構造実装
├── index.ts
└── README.md
```

## 🌟 機能概要

- **AI文章生成**: OpenAI APIを使用した動的な文章生成
- **リアルタイム入力判定**: Trie構造による高速な入力処理
- **タイピング統計**: 正確率・速度・ミス数の詳細計測
- **ゲームモード**: シミュレート・プレイモードの切り替え
- **タイマー管理**: 制限時間とカウントダウン機能
- **キーボード処理**: 複数のローマ字パターン対応

## 🧩 主要コンポーネント

- **TypingCard**: タイピングゲームのメイン画面
- **TimerCard**: 制限時間表示とカウントダウン
- **DetailCard**: ゲーム詳細情報表示
- **ModeSelector**: ゲームモード選択

## 🎣 主要フック

- **useTyping**: タイピングゲームの統合管理フック
- **useGenerator**: AI文章生成管理フック
- **useTimer**: タイマー管理フック
- **useKeydown**: キーボード入力処理フック

## 🗂️ 主要型定義

### Sentence（文章）

```typescript
interface Sentence {
  kanji: string; // 漢字表記
  hiragana: string; // ひらがな表記
  romaji: string[][]; // ローマ字パターン配列
}
```

### RomajiProgress（入力進捗）

```typescript
type RomajiProgress = {
  typed: string[]; // 入力済み文字
  current: string; // 現在入力中文字
  remaining: string[]; // 残り文字
  inputString: string; // 入力文字列
  isValid: boolean; // 入力妥当性
  nextChars: string[]; // 次の入力候補
  shortRomaji: string[]; // ショートカットローマ字
  missedChar: string; // ミス文字
  expectedChar: string; // 期待文字
};
```

## ⚙️ Trie構造による高速処理

### RomajiTrie

複数のローマ字パターンを効率的に処理するデータ構造

## 🎮 ゲームモード

### シミュレートモード

- 練習用、ベット不要
- 固定制限時間（60秒）
- 経験値のみ獲得

### プレイモード

- 本格的、ベット必要
- ベット額により可変制限時間
- ゴールド獲得・ランキング反映

## 📊 統計計算

### 正確率計算

```typescript
const accuracy = Math.round((correctTypeCount / totalTypeCount) * 100);
```

### 速度計算

```typescript
const wpm = Math.round(correctTypeCount / 5 / (time / 60)); // Words Per Minute
```

## 🔗 関連機能

- ベッティング: `@/features/betting`
- 結果表示: `@/features/result`
- 認証: `@/features/auth`
- API通信: `@/actions/games`
