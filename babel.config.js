module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 安装在Development dependencies，并在这里配置路由懒加载，提高加载效率
    "@babel/plugin-syntax-dynamic-import"
  ]
}
