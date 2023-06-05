/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: (config) => {
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: (assetFilename) => assetFilename.endsWith('.js')
    }
    config.externals = {
      ace: 'ace',
      vue: process.env.NODE_ENV === 'production' ? 'vue' : 'Vue'
    }
  },
  chainWebpack: (config) => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/gateway': {
        target: 'https://saas.yunzhu.de/',
        // target: 'http://192.168.10.21/',
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          Connection: 'keep-alive'
        }
      }
    },
    open: true
  }
}
