---
title: React Hook 父子通信
date: 2020-08-22 12:32:37
tags: [react, umi]
---

## 父组件

在 `react` 中使用函数组件以及 `hooks` 之后，有遇到，在父组件需要调用子组件方法的地方，可以通过 `ref` 的转发，做到在父组件执行子组件的方法，为什么需要转发 `refs`，是因为默认情况下，函数组件没有实例，无法使用 `ref` 属性。所以如果需要在函数组件中使用 `ref`，其是指向 `dom` 元素。

其具体流程是：在父组件中创建 `ref`，并且通过属性的方式传递给子组件，子组件通过 `forwardRef` 包裹子组件，这样才能在子组件中的第二个参数中获取到 `ref`，此时获取到 `ref` 之后，`ref` 已经转发成功，当 `ref` 挂载完成之后，`ref.current` 将会指向子组件。

- `parent.tsx`，引入`useRef`

<img :src="$withBase('/assets/images/react/parent.png')" width="500px">

## 子组件

- `child.tsx`，引入`forwardRef`和`useImperativeHandle`
<img :src="$withBase('/assets/images/react/children.jpg')">
