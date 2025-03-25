/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  output: "standalone",
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300,   // Delay before rebuilding
    };
    return config;
  },
});

export default nextConfig;