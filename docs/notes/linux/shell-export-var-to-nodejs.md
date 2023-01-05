---
title: 导出系统变量
date: '2022-04-30'
tags: [shll]
---

#### 利用 `shell` 在构建 `run npm` 命令的时候传递不同参数解决频繁改动代码的问题

## 场景

如果我们做移动端开发，有时候需要调试一些东西，例如我们会用 `vconsole`，我们可能会写这一段代码

```js
if (process.env.NODE_ENV !== "production") {
  import("vconsole").then((res) => {
    new res.default();
  });
}
```

但是有另一种情况，我们部署到测试环境了，我们依然需要打开调试，但是部署之后如果我们不设置环境变量，我们的环境依然是线上环境，也就是 `process.env.NODE_ENV` 是 `production`。

## 思路

基于这个问题，我们可以在构建的时候去做一些处理：

执行 `shell` 构建的时候我们为对应的构建命令传递参数，`shell` 拿到这个参数之后，就可以把参数加到环境变量中，`node` 便可以读取出来，从而在我们打包的时候，`node` 从 `process.env` 中读取这个值进行不同的逻辑处理。

如果我们的构建是通过 `shell` 来编写的话，那会更加容易和好理解。
假设我们的项目是 `vue`，并且根目录下构建脚本是这样子的目录：

```js
+script 
    - dev.build.sh
    - pro.build.sh;
```

我们的 `package.json` 里面会有 `dev` 和 `pro` 的 `build` 命令。
`package.json` 里的命令假设如下：

```json
"script": {
  "dev:build": "env MODE=build vue-cli-server build",
  "build": "env MODE=build vue-cli-server build",
}
```

我们最终还需要有 `web` 来触发 `sh`，并且可以承载手动构建的时候传递不同的参数。

从上边的命令来看，本地打包和生产打包其实没有什么区别，分别是开发环境下的 `build` 和生产环境下的 `build`，那我们部署测试环境的时候一般都使用的是 `npm run build`，而我们上线时候的打包命令也是这个。那我们怎么才能区分出来是什么环境呢？

## 实现

假设我们的 `shell` 是这样写的

```sh
#!/bin/bash

VCONSOLE_ENABLE=$1

if [[VCONSOLE_ENABLE === '1']] ;then
  export VCONSOLE_ENABLE=true
fi

# 可以在这里根据业务需要任意导出系统变量
# export ENABLE_CDN=true ...

npm run dev:build
```

如果我们手动构建可以在 `web` 端通过 `ci` 把参数值分别传递不同的命令中，这样我们就可以在 `web` 手动构建的时候为不同的环境构建传递不同的参数值，当我们执行 `sh script/dev.build.sh ${VCONSOLE_ENABLE}`，我们便会在 `sh` 里获取到对应的变量`$1`，从而通过 `shell` 条件导出环境变量，`1` 开启，其他值关闭，并且默认应该关闭。

这个时候我们的 `node process` 是可以读取到这个变量的，通过 `process.env.VCONSOLE_ENABLE === 'true'` 便可以判断是否需要开启调试，从而在构建的时候执行要不要引入 `vconsole`。

::: tip
有一点需要注意，就是必须要用 webpack 提供的 define 插件来定义下数据，这样在框架层面才能使用
:::

最终我们 `main.js` 的代码会变成：

```js
if (process.env.VCONSOLE_ENABLE === "true") {
  import("vconsole").then((res) => {
    new res.default();
  });
}
```

从而在构建的时候解决需不需要开启调试的功能而非每次修改代码~~
