# 🤝 ヘルパー機能 (Helper)

ユーザー体験向上のための補助機能を提供するモジュールです。

## 📁 ディレクトリ構造

```
helper/
├── components/
│   ├── HomeButton/          # ホーム遷移ボタン
│   │   ├── HomeButton.tsx
│   │   ├── HomeButton.module.scss
│   │   └── index.ts
│   ├── ScrollHelper/        # スクロール補助
│   │   ├── ScrollHelper.tsx
│   │   ├── ScrollHelper.module.scss
│   │   ├── ScrollHelper.types.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/                   # 将来のフック追加用
├── index.ts
└── README.md
```

## 🌟 機能概要

- **ナビゲーション補助**: ホームボタンなどの便利な移動機能
- **スクロール制御**: 滑らかなスクロール操作とページ内移動
- **アクセシビリティ**: ユーザビリティ向上のための支援機能
- **ユーザビリティ**: 直感的な操作をサポートする機能群

## 🧩 主要コンポーネント

### HomeButton

ホーム画面への遷移を提供するボタン

**機能:**

- ワンクリックでホーム遷移
- 現在のページ状態保存
- カスタマイズ可能なスタイル
- アクセシビリティ対応

### ScrollHelper

スクロール操作を補助するコンポーネント

**機能:**

- 滑らかなページ内移動
- スクロール位置の監視
- トップに戻るボタン
- 進捗インジケーター

## 🔗 関連機能

- ナビゲーション: `@/hooks/routing`
- UIコンポーネント: `@/components/ui`
- レイアウト: `@/components/layouts`

## 📋 将来の拡張予定

### 追加予定のコンポーネント

- KeyboardShortcuts: ショートカットキー支援
- TooltipHelper: ツールチップ表示機能
- AccessibilityHelper: アクセシビリティ向上機能
- ResponsiveHelper: レスポンシブ対応支援

### 追加予定のフック

- useScrollPosition: スクロール位置管理
- useViewportSize: ビューポートサイズ監視
- useKeyboardShortcuts: キーボードショートカット
- useFocusManagement: フォーカス管理

## ⚠️ 注意事項

- フローティングボタンは他のUIと重複しないよう注意
- スクロール監視はパフォーマンスに影響する可能性
- アクセシビリティを考慮したキーボード操作に対応
- モバイル環境でのタッチ操作に配慮した実装
