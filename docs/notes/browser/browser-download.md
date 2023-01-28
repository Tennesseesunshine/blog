---
title: 浏览器下载方法
date: 2020-10-21 22:15:24
tags: 浏览器
---

通过 `http` 请求返回的 `json` 数据，如何下载到本地作为调试的 `mock` 数据？

## 基本类型介绍

浏览器中的下载一般都会涉及到二进制，浏览器中常见的二进制以及特殊的数据相关的用的最多 `Blob，DataURL，Base64 ，ObjectURL`。

- `Blob` 类型

是浏览器端的类文件对象，存储着二进制的数据，其接受两个参数，第一个参数，`array` 是一个由 `ArrayBuffer` , `ArrayBufferView` , `Blob` , `DOMString` 等对象构成的 `Array` ，或者其他类似对象的混合体，它将会被放进 `Blob` 。`DOMStrings` 会被编码为 `UTF-8` 。第二个参数是文件的 `MIME` 类型

- `Data URL` 格式

```js
// 格式
data:[<mediatype>][;base64],<data>

// 浏览器地址栏可以直接访问
data:text/html,<h1>Hello%2C%20World!</h1>
```

- `Base64`

最常用的场景一般是将图片压缩处理，但是编码之后存储较大

- `ObjectURL`

浏览器的 `URL` 对象生成一个地址来表示 `Blob` 数据

```js
URL.createObjectURL(new Blob("hello, world".split("")));
```

## 解决思路

一般接口返回值都是 `json` 结构，所以可以先将其 `JSON.stringify` 序列化为 `JSON` 字符串，想要将接口返回的数据下载，有两种思路

- 将 `JSON` 字符串文本转换为 `Data URL`
- 将 `JSON` 字符串文本转换为 `Blob` ，再由 `Blob` 创建 `ObjectURL`

最终都通过 `a` 标签的模拟点击来下载

伪代码：

```ts
const download = (url: string, name: string) => {
  const aTag = document.createElement("a");
  aTag.download = name;
  aTag.rel = "noopener";
  aTag.href = url;
  // 触发模拟点击
  aTag.dispatchEvent(new MouseEvent("click"));
};

// 方案1:
const downloadStr = JSON.stringify(data, null, 2); // 第三个参数用来将数据格式化一下
const dataUrl = `data:,${downloadStr}`;
download(dataUrl, "data.json");

// 方案2:
const downloadUrl = URL.createObjectURL(new Blob(downloadStr.split("")));
download(downloadUrl, "data.json");
```
