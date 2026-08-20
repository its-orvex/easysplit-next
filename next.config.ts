import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/new-trip',
        destination: '/app/new-trip',
        permanent: false,
      },
      {
        source: '/trip/:id',
        destination: '/app/trip/:id',
        permanent: false,
      },
      {
        source: '/trip/:id/add-expense',
        destination: '/app/trip/:id/add-expense',
        permanent: false,
      },
      {
        source: '/join/:code',
        destination: '/app/join/:code',
        permanent: false,
      },
      {
        source: '/view/:token',
        destination: '/app/view/:token',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
