---
title: 从零开始手写简单 loader（二）
date: 2021-01-26 22:23:15
tags: webpack
---

这是关于 `webpack` 的一些扩展。

[从零开始手写一个简单的 loader（一）](/tools/webpack/md-to-html-loader.html) 里面已经生成了 `html` 字符串并且渲染到了页面。但是我们发现其样式无美感，那这一期我们增加一些样式，将生成的 `html` 渲染的像咱们博客中的那样。

首先我们需要的 `loader` 是 `css-loader` 和 `style-loader`，我们开始安装这两个依赖。
`css-loader` 用于将 `css` 可以模块化的引入，并将其转换为 `js` 代码，`style-loader` 用于将上一步生成的 `js` 中包含的 `css`，生成可用的样式并且，通过生成 `style` 标签插入到 `head` 标签中。

- 安装依赖

```sh
cnpm install --save-dev css-loader style-loader
```

我们接着来配置 `webpack.config.js` 文件，在 `module` 的 `rules` 里再加上一个匹配项:

```diff
rules: [
  {
    test: /\.md$/,
    use: [
      './loader/md2html-loader.js'
    ]
  },
+  {
+    test: /\.css$/,
+    use: [
+      'style-loader', 'css-loader'
+    ]
+  }
]
```

- 创建 `css` 文件

紧接着我们在 `src` 下创建一个 `index.css` 文件，添加如下 `css` 样式：

```css
pre {
  display: block;
  background-color: #282c34;
  color: #fff;
  padding: 20px 24px;
  text-align: left;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  border: 1px solid transparent;
  line-height: 1.4;
  transition: all 0.3s;
  font-size: 14px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 13px 0;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
}

pre code {
  font-family: inherit;
  color: #fff;
  padding: 0;
}

code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  color: palevioletred;
}
```

- 引入样式文件

然后我们回到 `main.js` 里将 `index.css` 引入：

```js
import "./index.css";
```

现在我们再去终端运行 `npx webpack`，再刷新页面，发现生成的 `html` 已经被我们加上了样式。

<img :src="$withBase('/assets/images/webpack/render-html.png')">

截至目前我们已经完成了一个可以生成 `html` 的 `loader`，并且已经为其加上了样式。

我们目前用的是 `style-loader` 是将生成的 `css` 通过 `style` 的方式插入到 `head` 标签中。其实我们还有一种办法，将 `css` 提取出来，作为单个文件通过 `link` 标签加载。话不多说，我们继续。

- 提取 `css`

要提取 `css` 样式文件，`webpack4.0` 之后用的插件叫: `mini-css-extract-plugin`
我们来安装这个插件:

```sh
cnpm install --save-dev mini-css-extract-plugin
```

因为 `style-loader` 和 `mini-css-extract-plugin` 插件不能共存，所以我们需要删除 `webpack` 中之前配置的 `style-loader`，添加 `mini-css-extract-plugin`，具体修改如下：

`webpack.config.js`

```diff
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module: {
  rules: [
    {
      test: /\.md$/,
      use: [
        './loader/md2html-loader.js'
      ]
    },
    {
      test: /\.css$/,
      use: [
+       MiniCssExtractPlugin.loader, 'css-loader'
      ]
    }
  ]
},
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin(),
+ new MiniCssExtractPlugin()
]
```

我们再去终端运行 `npx webpack`，刷新页面发现样式没改变再去看开发人员选项，发现样式文件目前是通过 `link` 标签引入的，证明我们的提取 `css` 配置是生效的。

<img :src="$withBase('/assets/images/webpack/link-element.png')">

至此，我们一个简单的 `loader` 就全部完成了。
