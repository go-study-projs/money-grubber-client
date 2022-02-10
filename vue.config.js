const path = require('path')

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/moneygrubber2.0-website/' : '/',
  lintOnSave: false,
  chainWebpack: config => {
    const dir = path.resolve(__dirname, 'src/assets/icons') // __dirname表示当前目录

    config.module
      .rule('svg-sprite') /* 添加要遵守的规则*/
      .test(/\.svg$/)
      .include.add(dir)
      .end() // 只包含 icons 目录
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ extract: false })
      .end() // 配置loader
      .use('svgo-loader')
      .loader('svgo-loader')
      .tap(options => ({
        ...options,
        plugins: [{ removeAttrs: { attrs: 'fill' } }]
      }))
      .end() // 删除fill属性
    config
      .plugin('svg-sprite')
      .use(require('svg-sprite-loader/plugin'), [{ plainSprite: true }]) // 配置插件plugin
    config.module.rule('svg').exclude.add(dir) // 其他 svg loader 排除 icons目录
  }
}
