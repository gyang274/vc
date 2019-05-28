module.exports = {
  outputDir: './dist',
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
        // target: 'http://127.0.0.1:9090/',
        target: 'http://127.0.0.1:9090',
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
