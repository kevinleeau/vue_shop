// CONFIG ALL ELEMENT-UI FEATURES TO ENGLISH VERSION
const path = require ('path')
const webpack = require ('webpack')
 
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': path.resolve (__dirname, './src/assets'),
        'components': path.resolve (__dirname, './src/components'),
        'views': path.resolve (__dirname, './src/views'),
      }
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin (/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
    ]
  },
}