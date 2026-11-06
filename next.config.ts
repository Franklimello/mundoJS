import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/conta/certificados/*/pdf': ['./public/fontes-certificado/*'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // O site não deve ser embutido em outras páginas. O executor de código
          // usa um iframe `srcdoc`, que não passa por este cabeçalho.
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/documentacao/oop',
        destination: '/documentacao/classes',
        permanent: true,
      },
      {
        source: '/documentacao/poo',
        destination: '/documentacao/classes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
