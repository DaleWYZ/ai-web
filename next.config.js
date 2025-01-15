/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.google.com'],
    unoptimized: true
  }
}

module.exports = nextConfig 