/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true,
    domains: ['lh5.googleusercontent.com', 'lh5.googleusercontent.com','lh5.googleusercontent.com/p','lh5'],
   },
  
};

module.exports = nextConfig;
