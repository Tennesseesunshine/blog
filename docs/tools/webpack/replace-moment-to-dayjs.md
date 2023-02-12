---
title: momentjs 一键切换为 dayjs
date: 2020-12-21 22:20:17
tags: [react, webpack]
---

公司 `umi` 创建的项目中，时间的处理使用的是 `momentjs`，组件用的 `ant-design`，而且 `ant-design` 的日期底层的时间处理也是用的 `moment`。项目一次打包成功之后发现 `moment` 占的体积比较大，于是考虑下将 `moment` 切换为比较小的 `dayjs`。

`.umirc.ts` 的默认配置中是支持不将 `locale` 文件打包进去的，但是需要配置 `ignoreMomentLocale:true` 来开启，但是虽然开启之后仍然还是有 `54kb` 左右的大小，于是考虑将其换做 `dayjs`，具体的是利用 `antd-dayjs-webpack-plugin` 插件，此插件是已经将 `moment` 替换为 `dayjs`，之前项目里写的 `import moment from 'moment'`，可以继续使用，虽然引入的是 `moment`，但其实引用的是 `dayjs`，这是因为这个插件的底层 `alias` 了名称。所以在 `dayjs` 不支持的一些地方，需要利用 `dayjs` 的扩展方法来增加，例如我的项目中使用了 `utc`，所以需要在 `global.ts` 里先
`var utc = require('dayjs/plugin/utc')` 引入 `dayjs` 的 `utc` 插件，再`dayjs.extend(utc)` 拓展，使用就可以了。

而 `.umirc.ts` 具体的配置，如下：

```js
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';

chainWebpack(config) {
  config.plugin('dayjs').use(AntdDayjsWebpackPlugin);
}
```

至于 `ignoreMomentLocale:true` 的原理应该是使用的 `webpack` 的 `ContextReplacementPlugin`

```js
chainWebpack(config) {
  //过滤掉 momnet 的那些不使用的国际化文件 只选择zh-cn
  config
    .plugin('replace')
    .use(require('webpack').ContextReplacementPlugin)
    .tap(() => {
        return [/moment[\/\\]locale$/, /zh-cn/];
  });
},
```
