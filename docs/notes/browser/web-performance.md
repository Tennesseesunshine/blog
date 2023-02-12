---
title: 部分 web 性能优化清单 🧾
date: 2021-04-26 22:39:58
tags: 性能优化
---

作为一名研发，到了一定程度之后对性能的优化是不可避免的，现总结一下在日常研发中，思考以及有过实践的一些性能优化点。

## 减少请求数

- 减少 `DNS` 查询时间。
- 利用浏览器本地存储或者 `redux、dva` 将请求数据缓存在本次会话中，避免多次请求。
- 利用 `url-loader` 对小图片进行 `base64` 转码通过增加体积换请求 或者 利用 `webpack5 - assets modules`。
- 配合 `webpack chunkhash` 合理使用浏览器缓存。

## 较小请求资源体积

- `webpack` 自带 `new TerserPlugin` 插件开启多线程 `js` 压缩。
- 生产环境看情况要不要进行 `mini-css-extract-plugin` 抽离 `css` 样式，利用 `optimize-css-assets-webpack-plugin` 压缩 `css`。
- `externals` 拆分不常变更的三方库，利用 `cdn` 加载。
- 开启 `tree sharking` 减少无用代码的引入。
- `IgnorePlugin` 忽略不需要的文件。
- 利用 `iconfont` 替换图标、图片。

## 提升网络传输速率

- 合理使用 `图片大小` 以及进行图片 `压缩`。
- `gzip` 压缩。
- `nginx` 代理以及负载均衡。
- `http2` 头部压缩（减少每次请求附带开销）、多路复用（保持一个链接可以用，减少握手次数带来性能损耗）、服务端推送（主动提前推送浏览器需要请求的资源）、请求优先级（重要的数据先请求或者先推送）。

## 构建

- `babel` 开启缓存，`babel-loader?cacheDirectory`。
- `loader` 指定 `include` 或者 `exclude`指定目录，缩小构建范围。
- `loader` 的耗时如果比较多的话，可以使用 `thread-loader` 开启多线程池，充分利用机器资源。
- `HardSourceWebpackPlugin` 为模块提供中间缓存，首次构建时间没有太大变化，但是第二次开始，构建时间极大减少。
- `pm2` 可以开启 `node cluster` 集群模式。
- `js` 设置 `chunkhash，css` 利用 `new extractTextPlugin('../css/bundle.[name].[contenthash].css')` 设置 `contenthash`（暂未尝试），目的：`js` 模块改变之后，因为引用了 `css`，如果依然使用 `chunkhash` 会导致 `css` 重复构建，所以利用插件设置只有 `css` 内容发生变化的才构建，提升效率。
