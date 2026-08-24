/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages — no server runtime, no Vercel-specific features.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
