---
title: 移动端适配解决方案
---

移动端适配有很多方案，其中 `rem` 是被大家一直利用的一种方案。

目前我司在用的另一种布局方案，`viewport`，`caniuse` 查询 `viewport` 的兼容性基本都没问题，整体支持率达到 `98.35%`。今天的主角是 `postcss-px-to-viewport`，移动端适配可以通过这个插件来解决。

要使用 `viewport` 适配方案，必须先要安装 `postcss-px-to-viewport` 这个包，`postcss-px-to-viewport` 是将 `px` 单位转换为 `vw、vh` 的一个 `npm` 插件。

在 `vue-cli` 创建的项目中来做一下演示

- 首先我们创建一个项目并且来安装对应的插件

```sh
vue create postcss-px-to-viewport-demo

cd postcss-px-to-viewport-demo && yarn add postcss-px-to-viewport -D
```

- 初始化好的 `vue` 项目根目录下创建 `.postcssrc.js` 文件
- 添加配置

```js
module.exports = {
  plugins: {
    autoprefixer: {}, // 浏览器自动添加相应前缀，如-webkit-，-moz-等等
    "postcss-px-to-viewport": {
      unitToConvert: "px", // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 5, // 转换后的精度，即小数点位数
      propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: [], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    },
  },
};
```

- 因为我们设置的基准宽度是 `750`，最后在 `vue-cli` 生成的文件中找一个 `vue` 文件，设置一下图片 `Logo` 大小为 `width: 75px` ，在浏览器控制台会发现图片的 `width` 变为 `10vw` 。至此可以看出我们的插件生效了~
