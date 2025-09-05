// client/next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
     loader: 'custom', // <-- 1. บอก Next.js ให้ใช้ Custom Loader
    loaderFile: './image-loader.js', // <-- 2. ระบุ Path ของไฟล์ Loader
    remotePatterns: [
      // --- เอา Comment ออก และเปิดใช้งานส่วนนี้ ---
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // -----------------------------------------
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;