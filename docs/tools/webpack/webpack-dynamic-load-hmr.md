---
title: webpack 异步加载原理以及HMR流程
date: 2021-01-30 20:13:34
tags: webpack
---

异步加载应该分为代码模块的异步加载和路由的异步加载，但其原理基本都是一样的，我们先来看一个模块的异步加载。

## 模块异步加载

### 初始化文件结构

首先我们一步一步开始，新建一个目录 `checkWebpackBundled`，安装 `webpack、webpack-cli、html-webpack-plugin、clean-webpack-plugin` 最终生成的文件结构大概类似于：

```js
|-- checkWebpackBundled
    |-- index.html // 用于html-webpack-plugin用的模板
    |-- package.json
    |-- webpack.config.js
    |-- src
        |-- buttonHello.js
        |-- buttonHi.js
        |-- main.js // webpack打包入口文件
```

### 编写文件内容

我们先来写一个 `main.js` 文件，其中直接引入两个文件一个是 `buttonHi.js` 另一个是 `buttonHello.js`，然后我们配置一下 `webpack`，编写一个 `index.html` 的模板。

`main.js`

```js
import buttonHi from "./buttonHi";
import buttonHello from "./buttonHello";

document.querySelector(".button-hi").addEventListener("click", () => {
  console.log("buttonHi", buttonHi);
});
document.querySelector(".button-hello").addEventListener("click", () => {
  console.log("buttonHello", buttonHello);
});
```

`buttonHi.js`

```js
const a = "button-hi!";

export default a;
```

`buttonHello.js`

```js
const a = "button-hello!!";

export default a;
```

`webpack.config.js`

```js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
/**
 * @type {webpack.Configuration}
 */
const config = {
  entry: "./src/main.js",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
  // 我们选择了dev模式，到时候打包完成之后的代码就不是压缩之后的，而且还是支持evel的sourceMap
  mode: "development",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};

module.exports = config;
```

`index.html` 模板

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack异步加载原理</title>
  </head>

  <body>
    <div id="app">
      <button class="button-hi">点我是 hi！</button>
      <button class="button-hello">点我是 hello!</button>
    </div>
  </body>
</html>
```

接下来我们开始在终端运行 `npx webpack`，生成了 `dist` 目录，里面有我们打包成功的 `js` 文件和 `HtmlWebpackPlugin` 插件为我们生成的 `index.html`，我们在浏览器中运行 `index.html`，依次点击页面的两个按钮发现，分别在浏览器控制台打印出了`buttonHi button-hi!`和`buttonHello button-hello!!`。而且我们发现，我们的两个依赖文件全部都被打包到了 `main.js` 文件中。我们来看一下这种模式打包的产物是什么：

首先我们打开 `main.js`，将代码折叠起来，我们发现最终打包成功的文件是一个自执行函数，我们来简单看一下有用的内容：

```js
(() => {
  // webpackBootstrap
  "use strict";
  // 我们来看__webpack_modules__这个对象是一个map的映射，key是我们需要加载的模块的名称也就是依赖文件的路径，value是一个函数，这个函数的返回值其实就是将我们的源码的内容转为了webpack的一些方法
  var __webpack_modules__ = {
    // 这里有三个模块，我们只看这一个，其他的同理
    "./src/buttonHello.js":
      /*!****************************!*\
  !*** ./src/buttonHello.js ***!
  \****************************/
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        // 这里是因为我们的webpack的mode设置的是develpoment模式，开启的eval的sourceMap，eval会将字符串变为可以执行的js
        eval(
          "__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst a = 'button-hello!!'\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (a);\n\n//# sourceURL=webpack://checkWebpackBundled/./src/buttonHello.js?"
        );

        /***/
      },
    "./src/main.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      // 战略性省略
    },
    "./src/buttonHi.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      // 战略性省略
    },
  };

  // 定义一个缓存模块
  var __webpack_module_cache__ = {};
  // webpack的加载函数，到最终CJS和ESM都是通过这个方法加载文件
  function __webpack_require__(moduleId) {
    // 跟nodejs的加载模块原理一致，之前读取过的话再次读取会从缓存中拿
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    // 没有命中的话，将新模块推入缓存中
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // 用__webpack_modules__的映射去执行对应的函数，也就是执行相应的moduleId对应的模块内容，将模块的加载挂在exports的对象上
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  // 这里就是初始化加载我们的入口文件
  __webpack_require__("./src/main.js");
})();
```

所以我们结合构建机制看一下，构建开始是：

`webpack` 转换代码并生成单个文件依赖，从入口文件开始递归分析并生成依赖图谱，即 `webpack` 能够找到入口文件，剩下的模块都是按照流程执行的。所以最后的执行流程是，`webpack` 最终打包生成的是一个 `IIFE`，其中有很多自执行函数是为`webpack_require`扩展增加的方法，而且我们能够发现我们编写的代码模块已经被 `webpack` 的内部扩展的方法包装过了，在最后我们发现`webpack_require("./src/main.js")`，这是调用了入口文件开始执行，这样打包生成的最后的文件，就会按照生成的依赖分别加载对应的模块文件，从而在浏览器中加载以及加载对应的页面或者方法。

引申出来的问题：到这里我们应该能够体会到一个缺点，如果项目的依赖太多且有的依赖很大，我们现在这种引入方式是有问题的，所有的引用最终如果都被打包到一个文件中，在初始化请求到时候，就会造成很多浪费以及延长加载时间，所以我们需要将有些依赖拆分出去，只在初始化的时候请求必须的文件，别的文件在执行的时候（动态引入的方法），或者路由切换的时候（路由懒加载）才去加载或者配合 `webpack` 的 `splitchunk` 来做分包。

### 动态加载的两种方法

- `ESM` 的 `import`
- `webpack` 的 `webpack.ensure`

`webpack` 已经不推荐使用 `webpack.ensure` 了，我们直接用 `import` 来测试。所以我们来使用 `import` 来异步加载模块，我们修改 `main.js` 文件

```diff
- import buttonHi from "./buttonHi";
- import buttonHello from "./buttonHello";

document.querySelector(".button-hi").addEventListener("click", () => {
-  console.log("buttonHi", buttonHi);
+  import(/* webpackChunkName */`./buttonHi`).then(data => {
+    console.log('data', data.default);
+  })
});
document.querySelector(".button-hello").addEventListener("click", () => {
-  console.log("buttonHello", buttonHello);
+  import(/* webpackChunkName */`./buttonHello`).then(data => {
+    console.log('data', data.default);
+  })
});
```

再次运行 `npx webpack` 发现我们的 `dist` 下打包出来三个 `js` 文件

```
|-- dist
    |-- index.html
    |-- main.js
    |-- src_buttonHello_js.js
    |-- src_buttonHi_js.js
```

我们能清楚的看到打包生成了三个文件，其中被我们 `import` 引入的文件分别被单独打包了。而且我们查看 `index.html` 发现只引用了一个入口文件 `main.js`，另外两个文件是没有被引入的。接下来我们在浏览器中继续刷新页面，发现 `network` 只请求了 `index.html` 和 `main.js` 文件。

我们开始点击第一个按钮，再观察 `network` 发现加载了 `src_buttonHi_js.js` 文件，并且浏览器控制台输出了我们要打印的文字，第二个按钮同理，也是在点击的时候采取主动请求。
然后我们看一下浏览器控制台面板的 `preview` 看看本次的请求的文件内容到底是什么

```js
(self["webpackChunkcheckWebpackBundled"] =
  self["webpackChunkcheckWebpackBundled"] || []).push([
  ["src_buttonHi_js"],
  {
    /***/ "./src/buttonHi.js":
      /*!*************************!*\
  !*** ./src/buttonHi.js ***!
  \*************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        "use strict";
        eval(
          "__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst a = 'button-hi!'\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (a);\n\n//# sourceURL=webpack://checkWebpackBundled/./src/buttonHi.js?"
        );

        /***/
      },
  },
]);
```

我们去查看打包后的文件发现这个 `webpackChunkcheckWebpackBundled` 是定义在一个叫做 `webpackJsonpCallback` 的方法中，而这个方法就是动态加载的核心。

```js
__webpack_require__.l = (url, done, key, chunkId) => {
  if (inProgress[url]) {
    inProgress[url].push(done);
    return;
  }
  var script, needAttach;
  // ......
  // 动态创建script标签的常规操作
  if (!script) {
    needAttach = true;
    script = document.createElement("script");

    script.charset = "utf-8";
    script.timeout = 120;
    if (__webpack_require__.nc) {
      script.setAttribute("nonce", __webpack_require__.nc);
    }
    script.setAttribute("data-webpack", dataWebpackPrefix + key);
    script.src = url;
  }
  inProgress[url] = [done];

  // 一些错误处理
  var onScriptComplete = (prev, event) => {
    // avoid mem leaks in IE.
    script.onerror = script.onload = null;
    clearTimeout(timeout);
    var doneFns = inProgress[url];
    delete inProgress[url];
    script.parentNode && script.parentNode.removeChild(script);
    doneFns && doneFns.forEach((fn) => fn(event));
    if (prev) return prev(event);
  };
  var timeout = setTimeout(
    onScriptComplete.bind(null, undefined, { type: "timeout", target: script }),
    120000
  );
  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);
  // 将生成的标签插入到head中
  needAttach && document.head.appendChild(script);
};
```

除了这个我们还能发现`__webpack_require__.l`中有动态创建 `script` 标签，插入到 `head` 的操作，但是本次我们只能看到动态请求，并没发现动态创建 `script` 插入到 `head` 中的操作，接下来我们来构建一个单页面应用来查看和验证一下是不是只有在路由懒加载的时候才会如此触发。

### 路由懒加载

路由懒加载我们使用 `react-cli` 来创建一个项目来验证以及看一下，路由加载的原理。

我们`npx create-react-app lazy-load-components`来创建一个 `react` 的项目，然后初始化之后的 `src` 文件目录应该是如下这样:

```sh
|-- src
  |-- App.css
  |-- App.js
  |-- App.test.js
  |-- index.css
  |-- index.js
  |-- logo.svg
  |-- reportWebVitals.js
  |-- setupTests.js
```

因为我们需要路由懒加载，所以需要手动安装一下 `react` 的路由，终端执行 `yarn add react-router-dom`，安装成功之后我们开始编写文件，我们在 `src` 下新建两个文件夹分别是 `components` 和 `utils`，在 `components` 下创建 `User.jsx` 和 `About.jsx` 并且在 `utils` 下创建 `index.js` 文件。最后的目录应该是:

```sh
|-- src
  |-- App.css
  |-- App.js
  |-- App.test.js
  |-- index.css
  |-- index.js
  |-- logo.svg
  |-- reportWebVitals.js
  |-- setupTests.js
  |-- components // 新增
  |   |-- About.jsx
  |   |-- User.jsx
  |-- utils // 新增
      |-- index.js
```

接下来编写：
`About.jsx`

```js
import React from "react";
const About = () => {
  return <>About 今天天气不错！</>;
};
export default About;
```

`User.jsx`

```js
import React from "react";
const User = () => {
  return <>User 在干嘛？吃了吗？吃的啥？</>;
};
export default User;
```

`utils -> index.js`

```js
import React from "react";
const Loading = () => <>loading</>;
/**
 * 实现路由分割
 * 需要配合React.Suspense
 * @param {*} components 传递一个方法，这个方法是动态导入的组件
 */
export default function dynamic(components) {
  const LazyComponents = React.lazy(components);
  return () => (
    <React.Suspense fallback={<Loading />}>
      <LazyComponents />
    </React.Suspense>
  );
}
```

`src -> index.js`

```diff
import React from 'react';
import './index.css';
- import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
+ import { HashRouter, Link, Route } from 'react-router-dom';
+ import dynamic from './utils'
+ const dynamicAbout = dynamic(() => import('./components/About'))
+ const dynamicUser = dynamic(() => import('./components/User'))

ReactDOM.render(
  <React.StrictMode>
-    <App />
+    <HashRouter>
+      <Link to="/">User页面</Link><br/>
+      <Link to="/about">切换到About页面</Link><br/>
+      <Route exact={true} path="/" component={dynamicUser}/>
+      <Route path="/about" component={dynamicAbout} />
+    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

修改完成之后保存，我们在终端执行 `npm start`，自动打开页面，我们发现修改的内容已经生效了，这个时候我们来回忆一下，在开发环境下 `webpack` 会将打包的文件放在内存中，其实跟手动 `build` 以文件的方式区别不大，只是在内存中这样读取会很快，所以我们重新刷新一下页面，加载的时候查看一下浏览器的 `network` 面板，发现加载了很多文件，我们能发现其中 `3.chunk.js` 就是我们的首页也就是 `User.js`，里面的逻辑就是一个 `webpackJsonp` 加载对应的 `chunk` 文件，再下边是一些热模块更新的内容。然后现在我们切换一下面板到 `Elements`，到 `head` 下查看一下，发现此时的 `script` 只有 `3.chunk.js` 也就是 `User.js`。
<img :src="$withBase('/assets/images/webpack/init_chunk.png')">

我们切换路由到 `about` 页面，再来观察，发现页面 `network` 加载了我们对应的组件，并且 `Elements` 的 `head` 中增加了一个 `script` 标签，其 `src` 就是我们刚刚看到的 `2.chunk.js` 也就说，在我们切换路由的时候浏览器去下载了对用的文件，并将其插入到 `head` 中，从而实现我们在路由切换完成之后，看到了对应组件或者页面的显示。所以这就验证了我们第一步里的代码分析动态加载 `script` 的那块。

<img :src="$withBase('/assets/images/webpack/load_about.png')">

<img :src="$withBase('/assets/images/webpack/hot_load_add_script.png')">

### 总结

所以至此我们大概能够清楚浏览器是如何加载我们 `webpack` 打包后的文件，流程大概应该是：`webpack` 将文件最终都打包成为`webpack_modules`的一个互相依赖的 `kay:value` 的一个映射，最外层是 `webpackBootstrap` 的一个 `IIFE`，`IIFE` 的最下边开始执行`webpack_require("./src/main.js")`也就是执行入口文件，因为已经形成了依赖，所以在执行对应文件的时候会按照我们代码编写的预期执行，至于动态加载的时候，动态加载方法只是在触发对应的事件的时候才会执行逻辑，而路由的懒加载则是，在切换路由之后，浏览器会发起一个对应的 `chunk` 的请求，将这个请求的文件下载成功之后，通过动态创建 `script` 的形式插入到 `head` 标签中，从而实现动态加载。

## HMR 热模块更新机制

我们能够在刚刚的截图中发现，在初始化的时候有一个 `ws://localhost:3000/sockjs-node` 的请求，那这个东西是干嘛的呢？其实这就是热模块更新的重要的机制。

<img :src="$withBase('/assets/images/webpack/HMR_init.png')">

我们先修改一下 `About` 组件的内容：

```diff
import React from 'react'
const About = () => {
  return <>
    关于用户的一些信息哈
+    <h1>这是一个标题</h1>
  </>
}
export default About
```

保存之后，发现页面自动更新了并且 `network` 自动加载了两个文件一个是 `json` 文件一个是 `js` 文件，我们来看看这些东西是什么。
<img :src="$withBase('/assets/images/webpack/gen_json_js_file.png')">

### 分析

我们发现，在我们初始化的 `ws` 里接受的 `data` 的是一个 `205487be9270982f923b` 的 `hash` 值，在我们修改文件保存之后，热模块自动更新的时候，会生成一个 `205487be9270982f923b.hot-update.json` 和`[chunkId].205487be9270982f923b.hot-update.js` 的文件，这个 `json` 文件返回了一个 `e3ab8e66727600303a2d` 的 `hash` 是用于连接下次热更新的于本次类似的加载操作，而 `js` 文件则是热模块更新重新打包的需要执行的文件内容，同样我们切换到 `Elements` 能够发现，热模块更新的时候下载的文件也是被直接插入到 `head` 标签中的从而实现 `script` 的实时替换和页面自动刷新。
<img :src="$withBase('/assets/images/webpack/hot_load_add_script.png')">

### 总结

热模块更新的机制大致是和懒加载的逻辑相同，只不过其在初始化时候，开启了一个 `ws` 的请求，当修改文件修改的时候，`webpack` 会监听文件的变动，`ws` 接受 `hash` 作为下一次热更新的文件请求，因为在初始化和每一次修改之后都会生成下一次热更新的一个需求请求文件的 `hash`，所以在修改文件之后，浏览器会根据上一次的热模块生成的 `hash` 来下载下一次的更新的 `js`，浏览器下载完成热更新打包的 `js` 之后再如同懒加载一样，动态创建 `script` 脚本插入到 `head` 标签中，实现自动更新页面。
