/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnline: true
  
  //disable: process.env.NODE_ENV === 'development',
  // other Next.js config options here
});

export default nextConfig;