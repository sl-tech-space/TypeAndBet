# 💰 ベッティング機能 (Betting)

ゲームにベットを行うための機能を提供するモジュールです。

## 📁 ディレクトリ構造

```
betting/
├── components/
│   ├── GoldBetCard/
│   │   ├── GoldBetForm/     # ベット入力フォーム
│   │   │   ├── GoldBetForm.tsx
│   │   │   ├── GoldBetForm.types.ts
│   │   │   └── index.ts
│   │   ├── GoldBetCard.tsx  # メインベットカード
│   │   ├── GoldBetCard.types.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── betting.types.ts     # ベット関連型定義
│   ├── useBetting.ts        # ベット処理フック
│   └── index.ts
├── index.ts
└── README.md
```

## 🌟 機能概要

- **ベット額管理**: ユーザーのベット額入力と設定
- **残高チェック**: リアルタイムな残高確認と制限
- **制限時間計算**: ベット額に応じた動的な制限時間設定
- **アニメーション**: 滑らかな残高表示更新
- **バリデーション**: ベット額の適切性チェック
- **ゲームモード対応**: シミュレート・プレイモード切り替え

## 🧩 主要コンポーネント

- **GoldBetCard**: ベッティング機能のメインコンポーネント
- **GoldBetForm**: ベット額入力専用フォーム

## 🎣 主要フック

- **useBetting**: ベッティング機能の中核フック

## 🎮 ゲームモード

### シミュレートモード (SIMULATE)

- 実際のベット処理なし
- 練習・デモ用
- 固定制限時間

### プレイモード (PLAY)

- 実際のゴールド消費
- 本格的なゲーム
- ベット額による可変制限時間

## 🔧 制限値設定

- 最小ベット額: 100G
- 最大ベット額: 10,000G
- 最小制限時間: 30秒
- 時間係数: 0.003

## 🔗 関連機能

- ゲーム処理: `@/features/games`
- タイマー管理: `@/features/games/stores/timerStore`
- ナビゲーション: `@/hooks/routing`
- API通信: `@/actions/betting`
