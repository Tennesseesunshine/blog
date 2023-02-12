---
title: Promise.all 和 Promise.race 实现
---

## `Promise.all`

首先我们从一个正常的例子来看拆解一下 `Promise.all`

### 拆解`Promise.all`

- 我们能知道 `all` 方法接受一个数组作为参数，具体来说应该是具有 `Iterator` 接口的数据。
- 根据 `Promise.all` 的特性还能知道，`Promise.all()` 方法用于将多个 `Promise` 实例，`包装`成一个新的 `Promise` 实例。言外之意，如果不是 Promise 就会先调用 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。
- 如果参数实例的状态`全部`变成 `fulfilled`，结果的状态才会变成 `fulfilled`，此时各个参数的返回值组成一个数组，传递给结果的 `then` 的回调函数。
- 参数实例中有一个被 `rejected`，结果的状态就变成 `rejected`，此时第一个被 `reject` 的实例的返回值，结果会传递给 `catch` 的回调函数。

我们根据上述的拆解，来进行一下代码的实现：

```js
function promiseAll(arg) {
  // 首先我们做个边界处理，这里暂时只 判断参数是不是数组
  // 规范的promise参数应该是具有Iterator接口的，所以我们这里只处理是数组和不是数组的情况
  // 是数组我们执行方法，不是数组则通过Promise.resolve()将原来的数据直接resolve出去

  if (Array.isArray(arg)) {
    // 我们都知道，all方法会在所有的实例都变成fulfilled的时候，才回去fulfilled，所以可想应该是有一个计数器
    // 在所有的实例执行完之后，判断完成的量等不等于传入的数组的长度，才将结果抛出，并且这个结果我们应该需要有一个数组去存储
    // 首先我们要知道，结果集和错误都是需要用resolve和reject从函数里抛出的，所以我们必须要用promise包一下

    return new Promise((resolve, reject) => {
      let count = 0;
      let len = arg.length;
      let result = [];
      for (let i = 0; i < len; i++) {
        // 在循环里执行每一个promise实例，但是虽然我们传入的arg是数组，但是数组的项不一定是一个promise的实例
        // 所以这里我们应该用Promise.resolve来将arg[i]包装一下

        Promise.resolve(arg[i])
          .then((res) => {
            // 我们应该在成功的回调函数里去处理一些事务，例如计数器增加、成功的返回值堆入结果集
            // 并且这里我们应该处理，当计数器等于实例参数的length的时候，将结果resolve出去
            // 也就是说执行完了所有的传入的实例

            count++;
            // 为了保证每一个次序没有问题，需要按照索引将每个实例的结果存在结果集中

            result[i] = res;

            // 所有实例完成将结果集抛出
            if (count === len) {
              return resolve(result);
            }
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  } else {
    // 这里处理当传入的参数不是数组类型的时候用promise包装一下返回，不throw err
    return Promise.resolve(arg);
  }
}
```

我们使用测试用例验证一下这个方法能不能用，首先模拟一个延迟函数，`delay`，然后再定义两个方法 `delay1，delay2`。

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

```js
const delay1 = () => delay(2000).then(() => "delay1");
const delay2 = () => delay(1000).then(() => "delay2");
```

调用，按照预期的话应该是打印出来两个数据。

```js
promiseAll([delay1(), delay2()]).then(([dd1, dd2]) => {
  console.log("dd1 dd2", dd1, dd2); // delay1 delay2
});
```

最后我们能发现确实已经可以返回两个延迟函数中的数据。

## `Promise.race`

还是根据其特性来实现，首先 `race` 的方法和 `all` 的基础性都是一样的，接受的参数以及类别等，其用法是多个实例中有一个实例率先改变状态，总结果的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给结果集的回调函数。

### 拆解`Promise.race`

- 首先基本和 `all` 的类似，然后由其特性可知，其实内部实现应该是谁先完成就谁返回，也就是循环体内部只要有一个成功执行完毕就可以 `resolve`。

我们来看一下具体实现：

```js
function promiseRace(arg) {
  // 依旧是边界判断

  if (Array.isArray(arg)) {
    let len = arg.length;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        Promise.resolve(arg[i])
          .then((res) => {
            // 执行成功有结果直接返回

            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      }
    });
  } else {
    return Promise.resolve(arg);
  }
}
```

`race` 最常见的一个场景就是，如果页面里有需要请求的接口，但是接口耗时如果比较长，这个时候可以利用 `race` 配合 `delay` 函数做一个兜底，发请求的同时开一个多少 `ms` 的定时器，如果定时器结束之前接口还没有响应的话则中断请求立即返回，而不至于接口一直处于 `pedding` 挂起状态。那我们可以根据这个例子验证一下 `race` 是否可以用。

我们这次修改一下两个延迟函数，

```js
const delay1 = () => delay(5000).then(() => "我请求需要5s时间太久了");
const delay2 = () => delay(2000).then(() => "如果接口响应大于2s我就不等了哈");
```

按照预期的话，`data` 的打印应该是延迟比较小的那个，因为先执行完成先返回了。

```js
promiseRace([delay1(), delay2()]).then((res) => {
  console.log("data", res); // data 如果接口响应大于2s我就不等了哈
});
```

由此可见我们的 `race` 通过用例验证也是可行的。

至此两个比较常用的 `promise` 的方法我们就实现了，其实很多东西从使用的角度上来看，内部实现原理大概都是能比较清楚的，所以我们就应该注意更多的细节，例如边界条件、类型包装、代码执行的位置等。
