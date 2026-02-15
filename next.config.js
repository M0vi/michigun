/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  productionBrowserSourceMaps: false, 

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'tr.rbxcdn.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 