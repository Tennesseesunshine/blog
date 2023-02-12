---
title: Promise 中 resolve 和 return
date: 2021-06-13 12:03:27
tags:
  - Promise
---

## 背景

最近遇到一个问题，具体的场景是，接口 `A` 返回一段可以让前端渲染的 `html` 字符串，这个字符串里包含里一个可播放的 `video` 的地址，但是地址是不可播放的，需要替换为另外一个可播放的域名。

## 处理流程

解决方式：先请求接口 `A` 获取 `html` 字符串，从中截取 `video` 的 `src` 属性，再调接口 `B` 将接口转换为可播放的 `url`，最后拿到新的 `url` 之后再通过正则的 `replace` 方法将对应的 `url` 替换成新的 `url`，然后再处理剩下的逻辑。

其实捋下来之后发现无非就是 `A` 的回调结果里调 `B` 接口，但是即便是嵌套一层，也不够优雅，于是在想利用 `Promise` 的串行处理，将回调打平，`Promise` 的处理无非也就是先去调用 `A` 接口，获取数据之后将结果传递出去再通过`.then` 拿到返回值数据，在`.then` 里再调新接口 `B` 从而解决问题。虽然后来确实通过 `Promise` 的链式调用解决了问题，但是这个过程中也有一些疑惑，就是如题。

## 拆解和理解

根据 `es6` 的 `resolve` 的理解，其函数的作用是，将 `Promise` 对象的状态从“未完成”变为“成功”（即从 `pending` 变为 `resolved`），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去，如果我们不 `resolve`，则数据一直被保存在上一个 `Promise` 的函数中。经过整理重新学习后发现，如果需要将 `Promise` 的返回的结果在当前函数的`.then` 里一直按照次序往下传递，其是必须要在上一步的 `then` 里将结果 `return` 才能在下一个 `then` 里接住，一旦在某一个 `then` 里 `resolve` 了，则在 `resolve` 的那个 `then` 后面的 `then` 中虽然后面的逻辑会执行，但是获取不到上一次计算的结果，反而是直接在 `resolve` 的 `then` 里将结果从当前函数传递出去了。

## 示例

具体用一个 🌰 来看：
假设现在我们有一个 `sleep` 的 `Promise` 的模拟异步方法，传递不同的 `ms` 数代表分别代表 `A、B` 俩接口。

```js
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 这是获取新url的接口B
var urlConvert = (url) =>
  new Promise((resolve, reject) => {
    console.log(`我们现在获取到了旧的url:${url} 要去请求新的`);
    sleep(500).then((res) => {
      if (true) {
        resolve("http//newVideoUrl.com");
      } else {
        reject("发生错误");
      }
    });
  });

var handleData = () =>
  new Promise((resolve, reject) => {
    // 接口A
    var initUrl = sleep(1000).then((res) => "http://oldVideoUrl.com");

    initUrl.then((res) => urlConvert(res)).then((res) => resolve(res));
  });

handleData().then((url) => {
  console.log("url", url);
});
```

这里我们能发现在 `handleData` 内部，我是需要先处理完数据，在最后才将处理完的数据 `resolve`，所以可以看到是前边通过箭头函数一步一步将上一次处理的结果 `return` 了，所以在下一个 `then` 里才获取到处理完成的数据，并且我们在最后一步通过 `resolve` 将结果返回，当我们在外部调用 `handleData` 之后，链式调用的结果是可以获取到 `url` 的值。

但是如果我们将最后一步结果依旧改成 `return` 的形式，我们再来看一下效果。

```diff
- initUrl.then((res) => urlConvert(res)).then((res) => resolve(res));
+ initUrl.then((res) => urlConvert(res)).then((res) => res);

handleData().then((url) => {
  console.log("url", url);
});
```

再次运行后，发现没有打印也就是没走到这里，说明如果直接 `return` 的话是无法从原来的函数里将 `Promise` 的结果传递出去的。

## 结论

这里基本上是更清楚了，如果不需要将结果传递出去，在 `then` 处理完成之后 `return value` 就好了，如果需要传递出去就将数据 `resolve(value)` 出去，至于 `resolve` 的时候要不要 加 `return` 就看还要不要处理 `resolve` 后面的逻辑，一般来说立即 `resolved` 的 `Promise` 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

所以如果上述例子改为

```diff
- initUrl.then((res) => urlConvert(res)).then((res) => resolve(res));
+ initUrl.then((res) => urlConvert(res)).then((res) => {
+  resolve(res)
+  console.log('resolve后，打印url前')
+});
```

便会在 `resolve` 的那次事件循环后，并且会在新的一轮 `handleData()` 前执行。
