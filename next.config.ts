import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["next-mdx-remote"],
  },
  async redirects() {
    return [
      // O nas → O mnie
      {
        source: "/o-nas",
        destination: "/o-mnie",
        permanent: true,
      },
      // Journal → Poradniki
      {
        source: "/journal",
        destination: "/poradniki",
        permanent: true,
      },
      {
        source: "/journal/:slug",
        destination: "/poradniki/:slug",
        permanent: true,
      },
      // Old service slugs → new service slugs
      {
        source: "/uslugi/filmy-dla-hoteli",
        destination: "/uslugi/filmy-dla-butikowych-hoteli",
        permanent: true,
      },
      {
        source: "/uslugi/video-nieruchomosci",
        destination: "/uslugi/filmy-dla-nieruchomosci",
        permanent: true,
      },
      {
        source: "/uslugi/filmy-architektury-i-wnetrz",
        destination: "/uslugi/filmy-dla-architektow-i-projektantow-wnetrz",
        permanent: true,
      },
      {
        source: "/uslugi/filmy-reklamowe",
        destination: "/uslugi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
