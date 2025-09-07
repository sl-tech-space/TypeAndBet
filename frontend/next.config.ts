import type { NextConfig } from "next";

const isProduction: boolean = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true, // 副作用検出＆安全性向上
  poweredByHeader: false, // "X-Powered-By" ヘッダー削除

  // Next.js Standaloneモード（本番環境のみ）
  ...(isProduction && { output: "standalone" }),

  // メモリ最適化設定
  experimental: {
    // メモリ使用量削減のための最適化
    optimizePackageImports: ["@/components", "@/features", "@/utils"],
    // 開発環境ではnodeMiddlewareを無効化
    ...(isProduction && { nodeMiddleware: true }),
    // 開発環境でのメモリ効率化
    ...(!isProduction && {
      esmExternals: false,
      forceSwcTransforms: false, // SWC変換を無効化してメモリ消費を削減
    }),
  },

  // キャッシュディレクトリの設定
  distDir: ".next",

  // Turbopack設定（開発環境では無効化してメモリ消費を削減）
  ...(isProduction && {
    turbopack: {
      rules: {
        "*.scss": {
          loaders: ["sass-loader"],
          as: "*.css",
        },
      },
    },
  }),

  // ビルド最適化
  compiler: {
    // 開発時のReactコンポーネント表示名を削除してメモリ節約
    removeConsole: isProduction,
  },

  // 本番環境での最適化
  ...(isProduction && {
    // 静的ファイルの最適化
    assetPrefix: "",
  }),

  // ESLint & 型チェック設定
  eslint: {
    ignoreDuringBuilds: !isProduction, // 本番はLintエラーでビルド中断
  },

  // Webpack最適化
  webpack: (config, { dev }) => {
    if (dev) {
      // 開発時のファイル監視最適化
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // 開発環境でのメモリ効率化
      config.parallelism = 1; // 並列処理数を制限

      // メモリ使用量を削減
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    } else {
      // 本番環境での最適化
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ヘッダーの設定
  async headers() {
    if (!isProduction) {
      // 開発環境ではCSP制限を緩和（React RefreshとWebpack HMR用）
      return [];
    }

    // 本番環境用は厳格なCSP設定
    return [
      {
        source: "/(.*)",
        headers: [
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

  // 末尾のスラッシュを削除
  trailingSlash: false,
};

export default nextConfig;
