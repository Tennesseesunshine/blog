---
title: umi 中使用 iconfont
date: 2020-12-21 22:46:03
tags: [react, umi]
---

## 背景

`ant-design` 自带的 `icon` 种类太少，遂找替代方案 `iconfont`。

## 步骤

- 首先需要创建一个函数组件，使其接受一个名为 `name` 或者 `type` 的参数，用来指定当前渲染的 `icon` 名称。

`Iconfont.tsx`

```js
import React from 'react';
import './index.less';

interface IconfontProps {
  name: string;
  className?: string;
}

const Iconfont: React.FC<IconfontProps> = ({ name, className = '' }) => {
  return (
    <svg className={`icon ${className}`} aria-hidden="true">
      <use xlinkHref={`#${name}`}></use>
    </svg>
  );
};

export default Iconfont;
```

```css
<!-- 这其中的样式根据项目调整 -->
.icon {
  width: 22px;
  height: 22px;
  vertical-align: -4px;
  fill: currentColor;
  overflow: hidden;
}
```

- `Umi.rc`中配置在 `iconfont` 中生成的静态资源地址。

```js
plugins: [
  scripts: [
    {
      src: `//at.alicdn.com/t/font_xxx_jxx.js`,
    }
  ]
]
```

- `tsx` 中使用。

```js
import Iconfont from 'Iconfont'

<Iconfont name="xxx"/>
```
