import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: ["./src"],
    prependData: `@use "sass:color";\n@use "./src/styles/variables.scss" as *;\n@use "./src/styles/animations.scss" as *;\n`,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
