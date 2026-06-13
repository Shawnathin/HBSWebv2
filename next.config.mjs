/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/.git/**",
        "**/.next/**",
        "**/node_modules/**",
        "**/assets/**",
        "**/public/assets/**",
        "**/backups/**",
        "**/contact-us-page-export/**",
        "**/Product card assets/**",
        "**/pool-table-project-handoff-2026-05-23-v2/**",
        "**/product-scraper/**",
        "**/scraped-products/**"
      ],
      followSymlinks: false
    };

    return config;
  }
};

export default nextConfig;
