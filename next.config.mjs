/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Avoid child-process worker spawn errors (EPERM) on restricted Windows environments.
    workerThreads: true,
  },
  ...(isVercel ? {} : { distDir: ".next-local" }),
};

export default nextConfig;
