---
title: 为博客增加PWA功能
date: 2021-01-31 16:25:34
tags: [pwa, Workbox]
---

## 概览

实现的PWA支持的博客：[https://tennesseesunshine.github.io/](https://tennesseesunshine.github.io/)

很早之前就了解过 `Service Worker` 再到后来的 `PWA`，并且一直想尝试为网站增加一些新的特性，尤其是 `PWA` 的可以将网站安装在桌面这一个功能非常吸引我，而正好 `github-pages` 是部署在 `https` 上，所以用 `workbox` 直接改造了基于 `github-pages` 的 `hexo` 个人博客。

`PWA` 的好处自然不用多说，其能发送快捷方式到桌面上这一功能，将用户的操作链由之前的最长的 打开浏览器->输入网址[面临敲错的尴尬地步]->渲染目标网站 或者最短的 打开浏览器->选择书签加载目标网站，优化到了只有点击发送到桌面的快捷方式直接打开网站这一步，即一触即达，而且没有浏览器菜单栏、地址栏的影响，再配合 `Service Worker` 实现的加速和离线访问，这可谓说是大大提高了用户的粘性，非常利于网站留存。

`PWA` 不是特指某一项技术，而是应用了多项技术的 `Web App`。其核心技术包括 App Manifest、`Service Worker`、`Web Push` 等。我们能够发现一些主流网站例如 `vue` 的官网、星巴克 `web` 版都是支持 `PWA` 的。

## `workbox`

`workbox` 是 `GoogleChrome` 团队推出的一套 `Web App` 静态资源和请求结果的本地存储的解决方案，该解决方案包含一些 Js 库和构建工具，在 `Chrome Submit 2017` 上首次隆重面世。而在 `workbox` 背后则是 `Service Worker` 和 `Cache API` 等技术和标准在驱动。

## `App Manifest`

一个 `json` 的文件，通过一系列配置，就可以把一个 `PWA` 像 `APP` 一样，添加一个图标到手机屏幕上，点击图标即可打开站点。

## `Service Worker`

也是 `PWA` 技术背后非常重要的角色，`Service worker` 实际上是一段 `js` 脚本，在后台运行，并不是在主线程中运行。它是作为一个独立的线程，运行环境与普通脚本不同，所以不能直接参与 `Web` 交互行为，无法操作 `dom` 等等，`Service Worker` 的出现是正是为了使得 `Web App` 也可以做到像 `Native App` 那样可以离线使用、消息推送的功能。`Service Worker` 是具有生命周期的，大概可以分为：安装、激活、卸载。

## 详细流程

- ### 安装依赖

```shell
cnpm install workbox-build gulp gulp-uglify readable-stream uglify-es --save-dev
```

- ### 新建文件

  我们首先在博客的根目录下新建 `gulpfile.js` 文件

大概解释一下 `gulpfile.js` 的文件内容：首先是 `gulp` 会执行一个任务叫`generate-service-worker`即生成 `service-worker`，当然这个任务名是自己随意起的，然后通过 `injectManifest` 注入，`globPatterns` 是匹配的所有资源的列表，博客首次加载时，自动将这些文件缓存，然后利用 `sw-template.js` 模板，最后在执行 `gulp build` 就会在 `hexo generate` 之后的 `public` 文件夹下生成一份线上可用的 `sw.js` 文件。第二个任务是压缩生成的 `sw`。

```js
const gulp = require("gulp");
const workbox = require("workbox-build");
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglify = composer(uglifyes, console);
const pipeline = require("readable-stream").pipeline;

gulp.task("generate-service-worker", () => {
  return workbox.injectManifest({
    swSrc: "./sw-template.js",
    swDest: "./public/sw.js",
    globDirectory: "./public",
    globPatterns: ["**/*.{html,css,js,json,woff2}"],
    modifyURLPrefix: {
      "": "./"
    }
  });
});

gulp.task("uglify", function() {
  return pipeline(gulp.src("./public/sw.js"), uglify(), gulp.dest("./public"));
});

gulp.task("build", gulp.series("generate-service-worker", "uglify"));
```

然后也在根目录下创建 `sw-template.js` 文件，我用的是 `6.1.0` 的 `CDN` 版本。

```js
// 使用Google Cloud Storage上的Workbox CDN
importScripts(
  `https://storage.googleapis.com/workbox-cdn/releases/6.1.0/workbox-sw.js`
);

// 这个prefix非常重要，需要改成自己的github的name
workbox.core.setCacheNameDetails({
  prefix: "tennesseesunshine"
});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.precaching.cleanupOutdatedCaches();

// workbox.routing.registerRoute 利用正则来匹配注册路由，类似于webpack的loader，匹配到之后用callback处理

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico)$/,
  // 缓存图片，以及设置缓存时间
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Fonts
workbox.routing.registerRoute(
  /\.(?:eot|ttf|woff|woff2)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "fonts",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets"
  })
);
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Static Libraries
workbox.routing.registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net/,
  new workbox.strategies.CacheFirst({
    cacheName: "static-libs",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// External Images
workbox.routing.registerRoute(
  /^https:\/\/raw\.githubusercontent\.com\/reuixiy\/hugo-theme-meme\/master\/static\/icons\/.*/,
  new workbox.strategies.CacheFirst({
    cacheName: "external-images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.googleAnalytics.initialize();
```

接着在博客主题的 `source` 源码下，创建 `manifest.json` 文件，用于发送到桌面快捷方式的一些配置。

```json
{
  "name": "填写你需要的名字",
  "short_name": "填写你需要的名字",
  "icons": [
    {
      "src": "/img/icons.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ],
  "theme_color": "#fff",
  "background_color": "#fff",
  "display": "standalone",
  "orientation": "portrait-primary",
  "start_url": "."
}
```

注意的事项：`icons` 下的 `sizes` 必须是正方形，并且需要大于 `144px` 左右，用 `256` 就可以。

- ### 执行
  先 `hexo` 生成静态文件，再有 `gulp` 生成 `sw` 缓存列表。

```
hexo g && gulp build
```

- ### 编辑模版

接下来我们还需要在 `HTML` 页面中加入相关代码以注册 `Service Worker`，并添加页面更新后的提醒功能。这个需要根据自己的目前使用的主题来修改，具体做法就是找到自己目前使用博客主题的目录，在其模版相关文件的`</body>`下，插入

```html
<div class="app-refresh" id="app-refresh">
  <div class="app-refresh-wrap" onclick="location.reload()">
    <label>已更新最新版本</label>
    <span style="cursor: pointer;">点击刷新</span>
  </div>
</div>

<script>
  if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener("controllerchange", function() {
        showNotification();
      });
    }
    // 因为在本地开发环境下不需要sw的缓存，在更新博客之后，刷新会刷不出来新的博客内容，所以这里判断如果是线上才注册sw否则就卸载掉

    // 这里的判断条件就是自己的博客的域名
    if (location.host === "tennesseesunshine.github.io") {
      window.addEventListener("load", function() {
        navigator.serviceWorker.register("/sw.js");
      });
    } else {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }

  function showNotification() {
    document.querySelector("meta[name=theme-color]").content = "#000";
    document.getElementById("app-refresh").className += " app-refresh-show";
  }
</script>
```

- ### 设置站点更新提示刷新的样式

依旧是找到自己的博客主题，找到 `css` 样式文件，在其下增加`_customs/custom.styl` 文件，写入一下内容：

```styl
.app-refresh
  background #000
  height 0
  line-height 3em
  overflow hidden
  position fixed
  top 0
  left 0
  right 0
  z-index 1031
  padding 0 1em
  transition all .3s ease
.app-refresh-wrap
  display flex
  color #fff

.app-refresh-wrap label
  flex 1

.app-refresh-show
  height 3em

```

再于统一导出的 `styl` 的文件中，引入
`@import "\_customs/custom"`

至此所有的配置都已经完成。

## 参考

[利用 Workbox 实现博客的 PWA](https://io-oi.me/tech/pwa-via-workbox/)

[博客实现 PWA 功能](https://guanqr.com/tech/website/realize-pwa/)
