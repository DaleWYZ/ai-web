/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.google.com'],
    unoptimized: true
  },
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname)
  }
}

module.exports = nextConfig 