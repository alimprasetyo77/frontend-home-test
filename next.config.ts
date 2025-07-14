/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.sellerpintar.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
