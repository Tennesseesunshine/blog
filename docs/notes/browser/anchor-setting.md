---
title: 设置锚点
date: 2020-11-06 22:51:55
tags: [h5-api, scrollIntoView]
---

在潜意识里使用最多的应该就是 `a` 标签配合其他标签的 `id` 属性去做页面锚点跳转，然而在有 `prompt` 并且路由在变化的时候会导致一些问题。因为在设置了 `prompt` 有数据的话会做离开页面数据不保存或者结束任务的提示逻辑，但是这个 `prompt` 又是基于路由的变化来确定有没有触发，所以在使用传统的方法增加锚点的时候 `url` 后会追加哈希值导致触发了 `url` 变动，`prompt` 没法简单判断出来目前是因为什么事件触发，从而导致在点击锚点的时候触发了 `prompt` 提示。正好最近学习了 `scrollIntoView` 就正好想着尝试解决一下。

## `a` 标签和 `id`

```js
// 设置，用户点击并跳转
<a href="#anchorId">锚点1</a>

// 待跳转标识的位置，使用id
<div id="anchorId">跳转到锚点1</div>

在点击 “跳转到锚点1” 的时候就会在url中加入哈希从而实现锚点跳转
```

## `scrollIntoView` api

- 语法说明

```js
element.scrollIntoView(); // 等同于element.scrollIntoView(true)
element.scrollIntoView(alignToTop); // Boolean型参数
element.scrollIntoView(scrollIntoViewOptions); // Object型参数
```

- 参数说明

  - `alignToTop`可选，一个`Boolean`值：

    - 如果为`true`，元素的顶端将和其所在滚动区的可视区域的顶端对齐。相应的 `scrollIntoViewOptions: {block: "start", inline: "nearest"}`。这是这个参数的默认值。
    - 如果为`false`，元素的底端将和其所在滚动区的可视区域的底端对齐。相应的`scrollIntoViewOptions: {block: "end", inline: "nearest”}`。

  - `scrollIntoViewOptions` 可选 一个包含下列属性的对象：
    - `behavior` 可选 定义动画过渡效果， `auto`或 `smooth` 之一。默认为 `auto`。
    - `block` 可选 定义垂直方向的对齐， `start`, `center`, `end`, 或 `nearest`之一。默认为 `start`。
    - `inline` 可选 定义水平方向的对齐， `start`, `center`, `end`, 或 `nearest`之一。默认为 `nearest`。

- 伪代码

```js
// 因为有兼容问题，所以需要用第三方包来处理一下兼容
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// 在render之前为需要锚点的元素增加data-xxx属性，在触发对应的事件，需要锚点到对应的位置的时候利用api跳转
// 如果是数组循环下来的结构的话可以将对应的id传递给函数，点击的时候获取对应的元素并且再去执行操作

const scrollToAnchor = (id) => {
  // 利用属性选择器 + querySelector
  const ele = document.querySelector(`[data-imageId=${id}]`)
  if (ele) {
    ele.scrollIntoView({block: 'start', behavior: 'smooth'})
  }
}

<img data-imageId="img" />
<div onClick={() => scrollToAnchor('img')}>跳转<div/>
```
