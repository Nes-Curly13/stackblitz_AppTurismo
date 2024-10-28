/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true,
    remotePatterns: [
      
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.',
        search: '',
      },
    ],
    
   },
  
};

module.exports = nextConfig;
