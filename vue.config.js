// config element-ui features to english version
const path = require ('path')
const { default: VueRouter } = require('vue-router')
const webpack = require ('webpack')
 
module.exports = {
  // configureWebpack操作对象，chainWebpack链式编程方式
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
  // 为项目设置2个不同的main.js入口，分别对应开发development(serve)和上线production(build)
  // 在**build模式**下，Webpack会把所以插件一起打包，造成文件体积过大，所以配置externals排除较大插件
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 在vue.config.js的**build模式**里配置需要排除打包的插件，然后在public/index.html里引入相关外部CDN链接
      // element-ui在build模式也用外部链接导入，但不在这里配置，直接在public/index.html里引入
      // config.set('externals', {
      //   vue: 'vue',
      //   'vue-router': VueRouter,
      //   axios: 'axios',
      //   lodash: '_',
      //   echarts: 'echarts',
      //   nprogress: 'NProgress',
      //   'vue-quill-editor': 'vueQuillEditor'
      // })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}