---
title: 事件循环
---

## 主线程

- 初始化压栈，执行同步任务、函数执行栈在主线程
- 主线程执行的是被压入执行栈的同步任务，不管来源是哪里，负责压入函数执行栈执行逻辑。异步任务的`callback`的逻辑会被事件循环通知后拿到这里来执行。

## `WebAPIs` - 任务队列 存放异步任务

- 【`XHR`】任务队列中的都是已经完成了`http`请求，是获取完数据等待执行的回调函数。

- `AJAX` `handleData.fetchData()`理解为网络线程先去请求数据，拿到数据之后`.then(res => {})`回调函数注册到任务队列，进入异步的都是回调函数中的那部分程序。

- 宏任务

  - 定时器、`I/O`

- 微任务

  - 在当前的微任务没有执行完成时，是不会执行下一个宏任务的
  - `Promise.resolve`和`return new Promise`都是同步任务立即执行
  - `async/await`执行完之后，会立即返回，就是`await`后的程序，可以当作是`then`的回调函数，原理都是一样，只是异步转为同步的语法糖。
  - 经典典型案例`Promise`练习

  ```js
  console.log("script start");
  async function async1() {
    await async2(); // 执行完立刻返回
    console.log("async1 end"); // 相当于.then的callback
  }
  async function async2() {
    console.log("async2 end");
  }
  async1();
  setTimeout(function () {
    console.log("setTimeout");
  }, 0);
  new Promise((resolve) => {
    console.log("Promise");
    resolve();
  })
    .then(function () {
      console.log("promise1");
    })
    .then(function () {
      console.log("promise2");
    });
  console.log("script end");
  ```

  - 同步任务开始 执行 `console.log` 打印 `script start`
  - 遇到 `async1()` 执行，内部执行 await 的方法 `async2` ，打印 `async2 end` ，跳出【因为 `await` 后的相当于异步回调】
  - 将 `async1 end` 注册到异步任务队列-微任务
  - `setTimeout` 注册到异步任务队列-宏任务
  - `new Promise` 同步执行打印 `Promise`
  - 分别注册 `promise1` 和 `promise2` 到微任务队列
  - 执行 `console.log` 打印 `script end`
  - 主线程变空，事件循环通知主线程去任务队列拿取回调任务执行，按照 `FIFO` 的接口依次是执行 `async1` 的 `console.log` 和 `promise` 的两个 `then`
  - 执行宏任务 `setTimeout`
  - 结果 `script start、async2 end、Promise、script end、async1 end、promise1、promise2、setTimeout`

## 事件循环 `Event Loop`

- 负责告诉主线程，执行哪个回调，分发任务，按照`FIFO`队列顺序执行。监听函数执行栈（主线程）是否为空，空则主线程从任务队列取出任务放进函数执行栈执行。

- 如果遇到主线程阻塞，异步任务队列的`callback`等待。

- 事件循环通知主线程，主线程从任务队列取出`callback`执行，是要主线程为空闲的时候才行，主线程如果一直有任务不释放，任务队列的`callback`一直是等待状态。
