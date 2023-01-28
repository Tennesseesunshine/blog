---
title: EventBus
date: 2021-01-14 22:54:22
tags: Vue
---

简单实现一个 vue 中的 `EventBus`，首先分析一下 `vue` 中的一些用法

## 注册

- `this.$on('eventName', (...params) => {})`

其实我们在使用的过程中可以发现，`$on`的事件可以注册多次，也就是说可以在很多组件里进行一个事件的注册，在`$emit` 触发相应的事件的时候，对应注册的所有事件都会执行回调函数，所以我们能想到它的实现一定是，如果在一个对象中，注册了相同的事件，会一直往当前的这个事件数组的集合中追加回调函数。

## 触发

- `this.$emit('eventName', params)`

上一步提到，`$emit` 的时候，相应注册的事件都会执行回调函数，而且 `on` 注册的是一个数组，所以其实现应该是遍历 `emit` 事件所对应的数组，依次执行 `callback` 并且将参数传递出去。

## 触发一次

- `this.$once('eventName', (...params) => {})`
  
触发一次，它的实现应该是无需判断之前事件有没有注册，要是注册直接放进去，也就是说，注册相同的事件后者会覆盖掉前者，注册新的会增加。

## 移除

- `this.$off('eventName)`

`off` 也很简单，就是直接用对象上删掉当前的事件。

在 `vue2.0` 的 `SFC` 中，`this` 指向是 `new Vue()`的实例 `vm`，因为其上实例上已经具有 `eventBus` 的方法，所以可以使用。

伪代码：

```js
let EventBus = {
  taskMap: {},
  $on(eventName, fn) {
    // 如果map中无注册事件，则将事件推入，如果有注册的事件，继续往里追加
    if (!this.taskMap[eventName]) {
      this.taskMap[eventName] = [fn]
    } else {
      this.taskMap[eventName].push(fn)
    }
  },
  $emit(eventName, ...msg) {
    if (!this.taskMap[eventName]) {
      return
    } else {
    //   遍历注册过的事件，依次执行
      this.taskMap[eventName].forEach(callback => callback(...msg))
    }
  },
  $once(eventName, fn) {
    // 不需要判断，后来的覆盖前边的
    this.taskMap[eventName] = [fn]
  },
  $off(eventName) {
    if (!this.taskMap[eventName]) {
      return
    } else {
    //   删掉注册的事件
      Reflect.deleteProperty(this.taskMap, [eventName])
    }
  }
}
```

使用

```js

// 注册
EventBus.$on("begin", (...x) => {
  console.log(...x);
});

EventBus.$off("begin");

EventBus.$emit("begin", "参数1000000", "参数2"); // 不会触发

EventBus.$once("begin", (...x) => {
  console.log(x);
});
EventBus.$emit("begin", "🍅", "🍉"); // 触发一次once ["🍅", "🍉"]
EventBus.$off("begin");

EventBus.$on("begin", (...x) => {
  console.log(...x, "1");
});
EventBus.$on("begin", (...x) => {
  console.log(...x, "2");
});
EventBus.$emit("begin", "🏃‍♀️", "🚢"); // 触发2次on 🏃‍♀️，🚢，1  🏃‍♀️，🚢，2
```
