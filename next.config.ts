/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Docker
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Added just in case
      }
    ],
  },
}

module.exports = nextConfig