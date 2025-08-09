# 📊 結果機能 (Result)

ゲーム結果の表示と管理を行うモジュールです。

## 📁 ディレクトリ構造

```
result/
├── components/
│   ├── ResultCard/          # 結果表示カード
│   │   ├── ResultCard.tsx
│   │   ├── ResultCard.module.scss
│   │   ├── ResultCard.types.ts
│   │   └── index.ts
│   ├── ResultContent/       # 結果コンテンツ
│   │   ├── ResultContent.tsx
│   │   ├── ResultContent.module.scss
│   │   ├── ResultContent.types.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useResult.ts         # 結果データ取得
│   └── index.ts
├── types/
│   ├── result.ts            # 結果関連型定義
│   └── index.ts
├── index.ts
└── README.md
```

## 🌟 機能概要

- **結果表示**: ゲーム終了後のスコア・統計表示
- **ランキング**: 全体ランキングと順位変動の表示
- **ゴールド管理**: ゲーム結果に基づくゴールド増減表示
- **統計データ**: 正確率・速度・ミス数などの詳細分析
- **結果保存**: セッション間での結果データ管理

## 🧩 主要コンポーネント

### ResultCard

ゲーム結果のメイン表示カード

**機能:**

- スコア表示
- ランキング変動
- ゴールド増減
- 統計サマリー

### ResultContent

結果詳細コンテンツの表示

**機能:**

- 詳細統計表示
- グラフ・チャート表示
- 比較データ表示
- アクションボタン群

## 🎣 主要フック

### useResult

結果データの取得と管理

## 🗂️ 主要型定義

### GameResult（ゲーム結果）

```typescript
type GameResult = {
  gameType: "SIMULATE" | "PLAY";
  success: boolean;
  score: number;
  currentGold?: number;
  goldChange: number;
  currentRank?: number;
  rankChange?: number;
  nextRankGold?: number;
  accuracy: number;
  speed: number;
  correctCount: number;
  missCount: number;
  timeUsed: number;
  difficulty: string;
  theme: string;
  category: string;
  createdAt: string;
  error?: string;
};
```

## 📊 計算ロジック

### スコア計算

```typescript
const calculateScore = (result: GameResult): number => {
  const baseScore = result.correctCount * 10;
  const accuracyBonus = Math.floor(result.accuracy * 2);
  const speedBonus = Math.floor(result.speed * 1.5);

  return baseScore + accuracyBonus + speedBonus;
};
```

### ランキング変動

```typescript
const calculateRankChange = (
  currentRank: number,
  previousRank: number
): {
  change: number;
  direction: "up" | "down" | "same";
} => {
  const change = previousRank - currentRank;

  return {
    change: Math.abs(change),
    direction: change > 0 ? "up" : change < 0 ? "down" : "same",
  };
};
```

## 🔗 関連機能

- ゲーム機能: `@/features/games`
- ベッティング: `@/features/betting`
- ナビゲーション: `@/hooks/routing`
- API通信: `@/actions/result`

## ⚠️ 注意事項

- 結果データはセッションストレージで一時保存
- ページリロード時にデータが失われる可能性
- ランキングデータは表示時点での情報
- アニメーションはパフォーマンスに配慮して実装

## 📋 今後の拡張予定

- 履歴機能: 過去の結果履歴表示
- グラフ表示: 成績推移のビジュアル化
- 達成バッジ: 特定条件達成時の表彰機能
- SNSシェア: 結果のソーシャルシェア機能
