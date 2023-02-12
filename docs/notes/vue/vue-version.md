---
title: Vue 2.X 两个不同的版本
date: 2020-11-08 22:56:34
tags: Vue
---

## `Runtime Only`

```js
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```

- 说明：`vue-loader + webpack`，会在构建的时候将`*.vue`打包为静态资源文件，最终的文件是已经被预编译之后的静态浏览器可以识别的资源，也是不需要编译器的可以直接运行的，即只有运行时。

## `Runtime + Compiler`

```js
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```

- 运行时+编译器，在`vue-loader + webpack`构建的时候，是不会进行编译的，在浏览器运行的时候进行编译。
