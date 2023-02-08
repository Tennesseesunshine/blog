---
title: 从零开始手写简单 loader（一）
date: 2021-01-25 22:21:04
tags: webpack
---

重学 `webpack` 之后，对 `webpack` 的理解又上了一个层次，`webpack` 的 `loader` 作为其一个非常重要的链路，能用自定义的 `loader` 来处理日常工作中遇到的问题俨然已经成为了一个前端工程师的基本素养，所以最基本的要求就是能够手写自定义的 `loader`。

`webpack` 自身只能够处理 `JS` 和 `JSON` 文件，而作为非此二者的其他文件，`webpack` 也是支持其作为模块通过 `import、export、export.default` 等，所以在对这些文件处理的时候，就需要对应的一些 `loader` 来解析，例如在项目中使用 `sass`，那肯定是不能缺少解析 `sass` 的 `loader`。使用 `ts` 少不了 `ts-loader` 等等。

而且 `loader` 在 `webpack` 中是可以进行串联调用，从其从后往前或者从右往左的顺序可以知道，`webpack` 采用的是 `compose` 的方式来在下一个 `loader` 中结合上一个 `loader` 处理完的结果。其实在这种串联组合中的 `loader` 并不一定要返回 `JS` 代码。只要下游的 `loader` 能有效处理上游 `loader` 的输出，那么上游的 `loader` 可以返回任意类型的模块。

今天的任务是写一个，将 `markdown` 转为 `html` 的 `loader`。

## 依赖分析

先分析一下构建这些， `webpack` 工具需要哪些东西，首先肯定需要 `webpack` 和 `webpack-cli` 作为最基础的依赖，然后需要 `marked` 将 `md` 文件转为 `html`，而且即便很简单的 `loader`，我们仍然需要一个 `CleanWebpackPlugin` 和 `HtmlWebpackPlugin` 作为在打包之前和成功之后最底层的支持，一个用于清除打包结果，一个用于生成打包后的 `html` 文件。所以我们汇总一下需要安装的几个依赖，分别是：

```
- webpack
- webpack-cli
- marked
- CleanWebpackPlugin
- HtmlWebpackPlugin
```

## 创建对应的文件夹、文件

首先我们需要利用 `npm` 自动生成一个 `package.json` 文件：

```
npm init -y
```

紧接着，我们在根目录下创建一个 `src` 文件夹、`loader` 文件夹以及其子文件 `md2html-loader.js` 和 `webpack.config.js` 文件，并且在 `src` 下创建 `index.md、main.js`，成功之后我们的文件夹目录应该是：

```
+ src
  - index.md
  - main.js
+ loader
  - md2html-loader.js
- package.json
- webpack.config.js
```

## 安装依赖

我们利用 `cnpm` 一次性将所需要的依赖全部安装完成。

```
cnpm install --save-dev html-webpack-plugin webpack webpack-cli marked clean-webpack-plugin
```

我们看看下载成功之后的依赖分别都是什么版本。发现 `clean-webpack-plugin` 是 `3.0.0`，在使用的时候我们需要解构出构造函数从而实例化，否则 `webpack` 会抛出`TypeError: CleanWebpackPlugin is not a constructor`的错误。

- `package.json`

```json
"devDependencies": {
  "clean-webpack-plugin": "^3.0.0",
  "html-webpack-plugin": "^4.5.1",
  "marked": "^1.2.7",
  "webpack": "^5.17.0",
  "webpack-cli": "^4.4.0"
}
```

## 编写文件内容

- `index.md`

```
# 今天是 2021 年，开始认真工作的一天

这是一个段落

- 这是第一项
- 这是第二项

这是一段落`code`

const a = 'webpack-demo'
console.log('a', a)
```

- `main.js`

```js
import md from "./index.md";

console.log("md", md);
```

- `md2html-loader.js`

```js
module.exports = (source) => {
  console.log("source", source);
  return "source";
};
```

- `webpack.config.js`

```js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// 增加Configuration是为了配置的key提示
/**
 * @type {webpack.Configuration}
 */
const config = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ["./loader/md2html-loader.js"],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
};

module.exports = config;
```

在终端输入 `npx webpack` 之后运行，我们能够发现，打印出了我们 `loader`文件里打印的 `source` 的内容，如下：

---

source # 今天是 2021 年，开始认真工作的一天

这是一个段落

- 这是第一项
- 这是第二项

这是一段落`code`

```
const a = 'webpack-demo'
console.log('a', a)
```

---

从这里我们能发现，其实 `loader` 接受的参数就是我们 `md` 文件的内容，所以我们需要将 `md` 文件转换为 `html`，就需要使用 `marked` 方法，继续编写 `loader` 文件，引入 `marked`，处理完成 `md` 文件之后，我们再将处理的文件组成文件内容导出。

- `md2html-loader.js`

```js
const marked = require("marked");
module.exports = (source) => {
  const html = marked(source);
  console.log("html", html);
  return `module.exports = ${JSON.stringify(html)}`;
};
```

我们再去执行，`npx webpack` 发现终端打印的输出为一段 `html` 字符串，这就是 `md` 文件被转换为 `html`：

---

```
html <h1 id="今天是-2021-年，开始认真工作的一天">今天是 2021 年，开始认真工作的一天</h1>
<p>这是一个段落</p>
<ul>
<li>这是第一项</li>
<li>这是第二项</li>
</ul>
<p>这是一段落<code>code</code></p>
<pre><code>const a = &#39;webpack-demo&#39;
console.log(&#39;a&#39;, a)</code></pre>
```

---

然后我们再打开 `dist` 目录下的 `index.html` 查看页面，`F12` 打开控制台发现浏览器控制台打印出了以下内容：

```
md <h1 id="今天是-2021-年，开始认真工作的一天">今天是 2021 年，开始认真工作的一天</h1>
<p>这是一个段落</p>
<ul>
<li>这是第一项</li>
<li>这是第二项</li>
</ul>
<p>这是一段落<code>code</code></p>
<pre><code>const a = &#39;webpack-demo&#39;
console.log(&#39;a&#39;, a)</code></pre>
```

浏览器控制台的内容就是我们 `main.js` 里打印的内容，至此，说明我们的模块已经生效，`md` 转为 `html` 也已经生效，并且当我们看到这个字符串的时候其实就已经明白怎么显示到页面上了。

于是我们继续编写 `main.js`将 html 字符串渲染到页面上：

- `main.js`

```js
import md from "./index.md";
// console.log("md", md);
const ele = document.createElement("div");
ele.innerHTML = md;
document.body.appendChild(ele);
```

继续运行，`npx webpack`，然后我们刷新刚刚的页面，发现生成的 `html` 字符串已经被我们渲染到页面上了。

至此一个 `md` 转换为 `html` 并且显示在页面的简单 `loader` 已经完成。
