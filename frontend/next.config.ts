import type { NextConfig } from "next";

const isProduction: boolean = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true, // 副作用検出＆安全性向上
  poweredByHeader: false, // "X-Powered-By" ヘッダー削除

  // ESLint & 型チェック設定
  eslint: {
    ignoreDuringBuilds: !isProduction, // 本番はLintエラーでビルド中断
  },
  typescript: {
    ignoreBuildErrors: !isProduction, // 本番は型エラーでビルド中断
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
