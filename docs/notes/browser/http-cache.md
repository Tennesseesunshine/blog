---
title: HTTP 缓存探究
---
最近在回顾缓存的一些知识点，先列出浏览器读取缓存过程会涉及到到的一些东西。

## `DNS` 缓存查询过程

`DNS` 缓存的目的主要是降低域名解析的时间延迟，最终解析成功之后，将所映射的 `IP` 返回给浏览器，并且于本地系统进行缓存，过程是递归的。

- 浏览器会检查浏览器缓存中有没有这个域名对应的解析过的 `IP` 地址。

- 如果用户浏览器缓存中没有数据，浏览器会查找操作系统缓存 `hosts` 文件中是否有这个域名对应的 `DNS` 解析的 `IP` 结果。

- 如果 `hosts` 也没命中，则向本地 `DNS` 服务器尝试发起解析请求。

- 如果本地 `DNS` 服务器没命中，则向根 `DNS` 服务器发起解析请求。

## `CDN` 缓存

当接入 `CDN` 之后，`CDN` 节点具有缓存机制。当客户端向 `CDN` 节点请求数据时，`CDN` 会判断缓存数据是否过期，若没有过期，则直接将缓存数据返回给客户端，否则就向源站点发出请求，从源站点拉取最新数据，更新本地缓存，并将最新数据返回给客户端。

### 不接入 `CDN`

- 输入域名之后，浏览器向 `DNS` 服务器发起请求，走 `DNS` 解析的过程，拿到 `IP` 之后直接向对应的 `IP` 的服务器发起请求，从源站点拉取最新数据，更新本地缓存，并将最新数据返回给客户端。

### 接入 `CDN`

- `CDN` 缓存不过期

  - 当浏览器本地缓存的资源过期之后，其不是直接向源站点请求资源，而是向 `CDN` 边缘节点请求资源，请求落在 `CDN` 这里的时候，因为 `CDN` 边缘节点中存在缓存，所以会使用 `CDN` 中的缓存。

- `CDN` 缓存过期

  - 若 `CDN` 中的缓存也过期，`CDN` 节点会向源服务器发出回源请求，从服务器拉取最新数据，更新本地缓存，并将最新数据返回给客户端。

## 浏览器缓存

### 强缓存

属于本地缓存，因为要么就是硬盘缓存要么就是内存缓存，其中优先级 `Cache-Control` 高于 `Expires`，并且一旦命中则不会向服务端发起任何请求。

- `Expires`

  - `HTTP1.0` 的产物，是一个绝对时间不准确。

- `Cache-Control`

  - `public` 认为都可以缓存
  - `private` 认为都可以缓存
  - `no-cache` 客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定，所以使用 `Etag` 或者 `Last-Modified` 字段来控制缓存

  - `no-store` 不使用缓存

  - `max-age` 所有的缓存会在设置的秒数之后失效

- 命中情况

  当做了有效缓存策略之后，网站第一次加载的时候获取的数据是先从服务器 `200` 请求，再因为设置缓存策略，关掉页面，再打开，数据再读取的缓存获取是从 `disk` 加载到内存中，所以重新打开的第一次是 `from disk cache`。

  当重新第一次打开加载成功之后的缓存是 `from disk cache` 并且被加载到了内存里，刷新页面，因为内存读取的优先级高于硬盘，所以刷新之后的缓存读取来源是 `from memory cache`。

  - `from disk cache`

    - 持久、相比内存慢、读取优先级低于内存

  - `from memory cache`

    - 非持久、快、读取优先级高于硬盘

### 协商缓存

当强缓存未命中之后，或者当强缓存的 `Cache-Control` 的值设置为 `no-cache` 的时候，根据 `1.1` 中的 `ETag` 优先级高于 `Last-Modified` 从而发起协商缓存。

即便如此，发起协商缓存在有没有接入 `CDN` 的时候，又可以分为两种情况。

先说 `HTTP` 请求和相应头：

- `HTTP1.0`

  - `Last-Modified`

    - 客户端第一次请求的时候，服务端会在响应头增加 `Last-Modified` 的 `header` 字段来告知浏览器对应的文件的最后修改时间。

  - `If-Modified-Since`

    - 下一次请求这个资源，浏览器检测到有 `Last-Modified` 这个 `header`，于是在请求头添加 `If-Modified-Since` 这个 `header`，它的内容就是第一次 `Last-Modified` 返回的数据。
    - 当服务器收到之后会用这个值和服务器上保存的最后一次文件的修改时间做对比，如果命中，则返回 `304`，告知浏览器使用本地缓存，否则返回 `200`，并且需要更新 `Last-Modified` 的值，并且一同返回资源。

- `HTTP1.1`

  - `ETag`

    - `Etag` 是服务器响应请求时，在响应头返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，`Etag` 就会重新生成，大体类似文件 `diff` 之后生成的一个 `hash` 值。

  - `If-None-Match`

    - 下一次请求这个资源，浏览器会将上次 `ETag` 返会的内容，通过 `If-None-Match` 的请求头传递给服务器。
    - 服务器收到之后会用这个和服务器上存的文件最后一次变动生成的 `ETag` 的值做对比，如果两个相同则返回 `304`，告知浏览器使用本地缓存，否则返回 `200`，并且需要更新 `ETag` 的值，并且一同返回资源。

所以汇总一下浏览器读取缓存整体的一个流程，在接入了 `CDN` 之后和不接入 `CDN` 的情况我们可以描述一下：

- 接入 `CDN` 之后，当用户在浏览器地址栏输入一个 `URL` 之后，浏览器会先去根据请求头来确定当前的强缓存的时效性，如果未失效，则会去读取本地缓存，至于读取 `disk` 还是 `momery`，需要看用户的行为。如果强缓存未命中，也就是说 `max-age` 的时间过期了，或者 `Cache-Control` 设置为 `no-cache`，则会进行协商缓存，协商缓存如果返回结果告诉浏览器，资源未更改，可以使用缓存，则浏览器依旧读取本地缓存。如果当协商缓存也失效之后，此时因为接入了 `CDN`，所以浏览器会向 `CDN` 的边缘节点发起请求，而不是进行一系列的域名解析去源服务器找缓存或者资源，但是这会面临 `CDN` 的缓存时效性，所以后面会执行上边的`【接入 CDN 的逻辑】`。

- 不接入 `CND` 之后，强缓存和协商缓存的命中逻辑都和接入 `CDN` 的一致，但是因为没有接入 `CDN`，所以需要进行域名解析等一系列步骤，执行的是上边`【不接入 CDN 】的逻辑`。

## 对缓存造成的影响

### 用户行为

- 第一次打开网页，获取内容存入 `disk`，再次打开如果 `disk` 有，则读取。没有则查看协商缓存
- 普通刷新，若第一次命中了 `disk` 的缓存，刷新的时候会直接读取 `memory` 并且优先级高于 `disk`
- 强制清缓存刷新，不使用本地缓存

### `webpack` 打包后的文件

- 如果设置了强缓存，在 `webpack` 打包之后，因为文件内容改变最终打包的名称 `chunkhash` 会改变，所以浏览器的缓存失效，就会请求新的资源，并不会导致出现请求旧的资源的问题。
  
  所以第一次请求新资源，以后可能会读取缓存。