import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/stargate',
  '@sushiswap/ui',
  '@sushiswap/swap-widget',
])

export default withTranspileModules({
  basePath: '/swap',
  reactStrictMode: true,
  swcMinify: true,
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
})
