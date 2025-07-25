/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/coins/**",
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc",
        pathname: "/logos/**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
