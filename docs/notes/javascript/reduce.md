---
title: reduce高级函数应用
date: 2021-01-15 22:36:38
tags: JavaScript
---

在最近的工作中，`reduce` 成为了出境率和使用率非常高的一个高阶函数，所以总结一下工作中以及 `reduce` 可能会实现的一些功能。

## 语法

先简单说一下 `reduce` 函数，它的语法为 `Array.reduce(callback, [initialValue])`，接受的参数是：

- 第一个参数为一个回调函数，其回调函数接受四个参数分别为初始值（或者上次的回调函数的返回值）、当前元素、当前索引、原数组。
- 第二个参数 `initialValue` 为可选，如果传递，则 `initialValue` 作为第一次回调函数的第一个参数。

需要记住的点是：如果为 `reduce` 提供 `initialValue` 参数，则回调函数会从索引为 `0` 的地方开始执行 `callback`，否则会从索引为 `1` 的地方开始执行。

我们可以用个 `demo` 验证一下

```js
// 无初始化参数
let arr = [9, 19, 20]
arr.reduce((pre, cur, idx) => {
  console.log(pre, cur, '看索引开始:', idx)
  return pre + cur
})
// 9 19 "看索引开始:" 1
// 28 20 "看索引开始:" 2
// 48

// 有初始化参数
let arr = [9, 19, 20]
arr.reduce((pre, cur, idx) => {
  console.log(pre, cur, '看索引开始:', idx)
  return pre + cur
}, 0)
// 0 9 "看索引开始:" 0
// 9 19 "看索引开始:" 1
// 28 20 "看索引开始:" 2
// 48
```

## 应用

### 数组求和

- 简单数组求和

```js
let arr = [1, 2, 3, 4, 5];
arr.reduce((pre, cur) => pre + cur, 0); // 15
```

- 复杂一点的，数组对象中的数据

```js
let list = [
  {
    name: "苹果",
    count: 20,
  },
  {
    name: "香蕉",
    count: 40,
  },
  {
    name: "猕猴桃",
    count: 90,
  },
];
list.reduce((pre, cur) => pre + cur.count, 0); // 150
```

### 统计字符串出现的次数

利用 `{}` 对象来判断是否能取到当前值，获取不到则表示当前元素没有，设置次数为 `1`，有则次数递增。

```js
const str = "aabcddeffghhijklllm";
str.split("").reduce((pre, cur) => {
  pre[cur] ? pre[cur]++ : (pre[cur] = 1);
  return pre;
}, {});
```

### 去重

利用 `includes` 判断上次累加的数组中是否具有当前值，没有的话就将当前值和上次的返回值连接起来返回，有的话直接返回上一次的结果。

```js
const arr = [1, 2, 2, 2, 3, 3, 4, 5, 5];
arr.reduce((pre, cur) => (!pre.includes(cur) ? [...pre, ...[cur]] : pre), []);
```

### 数组扁平化

- 二维简单数组

```js
const arr = [[1, 2], [3, 4], [5]];
arr.reduce((pre, cur) => [...pre, ...cur], []);
// [1, 2, 3, 4, 5]
```

- 复杂的高纬度数组

利用递归扁平深层嵌套的数组。

```js
const arr = [
  [
    1,
    2,
    [
      [3, 4],
      [5, 6],
    ],
  ],
  [
    3,
    [
      [7, 8],
      [8, 1],
    ],
  ],
  [
    5,
    [
      [5, 4],
      [9, 10],
    ],
  ],
];
const flat = (arr) =>
  arr.reduce(
    (pre, cur) => [...pre, ...(Array.isArray(cur) ? flat(cur) : [cur])],
    []
  );
flat(arr);
// [1, 2, 3, 4, 5, 6, 3, 7, 8, 8, 1, 5, 5, 4, 9, 10]
```

`ES6` 的解决办法：
使用数组的 `flat` 方法，语法 `arr.flat([depth])`，`depth` 参数为深度，不传参数默认扁平 `1` 级嵌套，可以输入关键字 `Infinity` 实现任何层数嵌套的扁平。
