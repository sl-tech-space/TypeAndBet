# 🌐 Google外部機能 (Google)

Googleが提供する外部サービスとの連携機能を管理するモジュールです。

## 📁 ディレクトリ構造

```
google/
├── components/
│   ├── AdSense/             # Google AdSense広告
│   │   ├── AdSense.tsx
│   │   ├── AdSense.module.scss
│   │   └── index.ts
│   └── index.ts
├── index.ts
└── README.md
```

## 🌟 機能概要

- **Google AdSense**: 広告表示機能
- **外部API連携**: Google提供サービスとの統合
- **パフォーマンス最適化**: 非同期読み込みとキャッシュ
- **プライバシー配慮**: GDPR準拠の実装

## 🧩 主要コンポーネント

### AdSense

Google AdSense広告表示コンポーネント

**機能:**

- 広告スロット管理
- レスポンシブ対応
- 自動最適化
- エラーハンドリング

## ⚙️ 設定

### AdSense設定

```typescript
// 環境変数
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID = ca - pub - xxxxxxxxx;

// 広告設定
const adSenseConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID,
  testMode: process.env.NODE_ENV !== "production",
  enableAutoAds: true,
};
```

## 🔒 プライバシー対応

### GDPR準拠

- ユーザー同意管理
- クッキー制御
- データ処理の透明性

## 🔗 関連機能

- 認証機能: `@/features/auth` (Google OAuth)
- 環境設定: `@/constants/env`

## ⚠️ 注意事項

- 認証機能は除外: Google OAuth認証は`@/features/auth`で管理
- AdSenseポリシー: Googleの広告ポリシーを遵守
- テスト環境: 本番環境以外では広告は表示されません

## 📋 今後の拡張予定

- Google Analytics: アクセス解析機能
- Google Maps: 地図表示機能
- Google Fonts: フォント最適化
- Search Console: SEO分析連携
