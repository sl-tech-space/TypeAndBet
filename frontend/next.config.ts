import type { NextConfig } from "next";

const isProduction: boolean = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true, // 副作用検出＆安全性向上
  poweredByHeader: false, // "X-Powered-By" ヘッダー削除

  // メモリ最適化設定
  experimental: {
    // メモリ使用量削減のための最適化
    optimizePackageImports: ["@/components", "@/features", "@/utils"],
    // キャッシュ最適化
    turbo: {
      rules: {
        "*.scss": {
          loaders: ["sass-loader"],
          as: "*.css",
        },
      },
    },
  },

  // ビルド最適化
  compiler: {
    // 開発時のReactコンポーネント表示名を削除してメモリ節約
    removeConsole: isProduction,
  },

  // ESLint & 型チェック設定
  eslint: {
    ignoreDuringBuilds: !isProduction, // 本番はLintエラーでビルド中断
  },
  typescript: {
    ignoreBuildErrors: !isProduction, // 本番は型エラーでビルド中断
  },

  // Webpack最適化
  webpack: (config, { dev }) => {
    if (dev) {
      // 開発時のメモリ最適化
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // キャッシュ設定でメモリ使用量削減
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };

      // 並列処理数を制限してメモリ使用量を抑制
      config.parallelism = 1;
    }

    return config;
  },

  // Sassの設定
  sassOptions: {
    includePaths: ["./src"],
    prependData: `@use "sass:color";\n@use "./src/styles/variables.scss" as *;\n@use "./src/styles/animations.scss" as *;\n`,
  },

  // 画像の設定
  images: {
    domains: ["lh3.googleusercontent.com"],
  },

  // ヘッダーの設定
  async headers() {
    if (!isProduction) return [];

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data:; " +
              "font-src 'self'; " +
              "connect-src 'self'; " +
              "object-src 'none'; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "upgrade-insecure-requests;",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cache-Control", value: "no-store" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), fullscreen=(), payment=()",
          },
        ],
      },
    ];
  },

  // HTTP → HTTPS リダイレクト（必要なら有効化）
  async redirects() {
    if (!isProduction) return [];
    return [
      {
        source: "/(.*)",
        destination:
          process.env.APP_URL ||
          `https://localhost:${process.env.FRONTEND_PORT}`,
        permanent: true,
      },
    ];
  },

  // 末尾のスラッシュを削除
  trailingSlash: false,
};

export default nextConfig;
