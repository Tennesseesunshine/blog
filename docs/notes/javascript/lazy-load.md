---
title: 图片懒加载
---

概述：因为内部项目运营工具中有遇到处理大量图片在一瞬间请求的场景，在开发阶段遇到了如果不处理图片，不用懒加载的话，浏览器会在一瞬间造成卡顿，用户体验和效果非常差。

解决方案

## 未调研的 `React` 三方懒加载库

## `img` 图片的属性 `loading`

  因为项目采用的是 `umi+ts`，而 `img` 属性的 `loading` 并未标准化，还处在实验阶段，但是 `Chrome 76+` 已经支持。代码中直接在 `jsx` 中为`img` 标签加上 `loading="lazy"` 属性之后会报错，是因为 `ts` 的类型中 `img` 不存在 `loading` 的属性，解决办法是声明一个类型文件，将需要设置的标签属性继承到 `HTML` 属性就好了，别的标签也类似。

  ```ts
  // react-unstable-attributes.d.ts
  import "react";

  declare module "react" {
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
      loading?: "auto" | "eager" | "lazy";
    }
  }

  // 参数
  lazy：延迟加载。
  eager：立即加载。
  auto：由浏览器来决定是否延迟加载。
  ```

  但是在直接为图片加了 `loading` 属性之后并没有实现懒加载，后来在调试的时候意外为图片加了 `width` 尺寸之后发现竟然生效了，或许在真实场景之下还需要微调。

  ```html
  <img loading="lazy" width="90px" />
  ```

  `loading="lazy"` 的属性对于别的浏览器的兼容一般，可以利用 `js` 判断，不支持 `loading` 的话使用`IntersectionObserver`优雅降级。[可参考](https://juejin.im/post/6844903830581149710)

## `IntersectionObserver`

  `IntersectionObserver` 提供了一种异步检测目标元素与祖先元素或 `viewport` 相交情况变化的方法。它会注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时(或者 视口 )，或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行。这样，我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。[摘自 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

  兼容的 `folyfill intersection-observer`

  伪代码

  ```jsx
  // 注册一个回调函数 满足条件的时候自动执行为图片src赋值
  const observer = new IntersectionObserver(function(changes) {
    changes.forEach(function(element, index) {

      // 当这个值大于0，说明满足我们的加载条件了，这个值可通过rootMargin手动设置
      if (element.intersectionRatio > 0) {
        // 设置图片src属性来加载
        element.target.src = element.target.dataset.src;

        // 放弃监听，防止性能浪费。
        observer.unobserve(element.target);
      }
    });
  });

  function initObserver() {
    [...document.querySelectorAll('.list-item-img')].forEach(item => {
      // 对每个list元素进行监听
      observer.observe(item);
    });
  }

  useEffect(() => {
    initObserver()
  }, [])

  // jsx
  <img class="list-item-img" data-src="1.png"/>
  <img class="list-item-img"  data-src="2.png"/>
  ```
