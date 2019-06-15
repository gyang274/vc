module.exports = {
  outputDir: '../../../vc-hk/dist',
  assetsDir: 'static',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/variables.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/server': {
        // target: 'http://127.0.0.1:3000/',
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/server': ''
        }
      }
    },
    watchOptions: {
      poll: true
    }
  }
}
