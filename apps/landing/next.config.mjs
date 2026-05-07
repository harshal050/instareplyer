/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@instareplyer/types', '@instareplyer/utils'],
  async rewrites() {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    return [
      {
        source: '/login',
        destination: `${clientUrl}/login`,
      },
      {
        source: '/register',
        destination: `${clientUrl}/register`,
      },
      {
        source: '/forgot-password',
        destination: `${clientUrl}/forgot-password`,
      },
      {
        source: '/dashboard/:path*',
        destination: `${clientUrl}/dashboard/:path*`,
      },
    ];
  },
};

export default nextConfig;
