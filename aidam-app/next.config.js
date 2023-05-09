/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'production' ? false : true
});

module.exports = withPWA({
  reactStrictMode: true,
});
