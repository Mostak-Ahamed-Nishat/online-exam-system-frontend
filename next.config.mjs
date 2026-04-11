/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isVercel ? {} : { distDir: ".next-local" }),
};

export default nextConfig;
