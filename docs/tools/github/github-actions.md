---
title: Github Action
date: 2022-12-10 16:10:54
tags:
  - github
  - CI
---

## 部署 vuepress 项目

本文是对自己将 hexo 迁移到 vuepress 并且利用 github actions 部署的一些总结

那如何利用 github actions 来部署一个 vuepress 的静态文件到 gh-pages 上？

### 创建 github actions token

首先需要给即将开启 github actions 的项目一个 token，作为一个认证，只有颁发了这个认证，才能在这个权限之内做一些事情。

- 个人面板下找到 Settings

<img :src="$withBase('/assets/images/github-actions/home_setting.png')" height="300px">

- 从 Settings 里找到 Developer settings，依次是 Personal access tokens --> Generate new token 生成 token，此处会让你输入密码，是为了确认本人操作

<img :src="$withBase('/assets/images/github-actions/dev_setting.png')">

token 生成之后，需要配置这个 token 对应的一些权限，此处我只需要对 repo 项目基础权限和 workflow 工作流权限就可以了。

此处用我的作为参考，其中 note 为你对这个 token 的用处，下边的是需要勾选的权限。

<img :src="$withBase('/assets/images/github-actions/token_info.png')">

记录刚才生成后的 token，复制，在 github 中，切换到你希望开启 github actions 的项目目录中，依次点击该项目的 `Settings --> Secrets --> New Secrets`。

将刚才复制的 token 粘贴，并取一个名字，保存。我的叫 ACCESS_TOKEN。如果喜欢其他名字也可以，但是后面的 `.github/workflows/xx.yml` 的脚本中要替换。

### 配置路径

vuepress 项目根目录下 `package.json` 文件中的 homepage 修改为 https://[你的 github 用户名].github.io/[你的项目名]，例如我的博客地址：[https://tennesseesunshine.github.io/blog](https://tennesseesunshine.github.io/blog)，将其对应修改。

### 开启 github actions

vuepress 官网里有教程如何通过 github actions 来部署，参考[https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages-and-github-actions](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages-and-github-actions)

此处贴一个我可用的 yml 文件

```yml
# 工作流的名称
name: gh-pages CI

# 工作流触发的时机，这里代表我当前仓库的 main 分支进行 push 操作的时候
# 触发 github actions 操作
on:
  push:
    branches:
      - main

# 表示任务，可以有多个任务
jobs:
  build-and-deploy:
    # 指定这个工作流会运行在哪个虚拟机 一般选择这个没问题
    runs-on: ubuntu-latest

    # 因为我们部署前端项目，所以这里可以做一个 node 版本号的选择
    # node-version 可以是 [10.x, 14.x ....] 指定多个版本
    strategy:
      matrix:
        node-version: [16.x]

    # 表示当前任务下的步骤
    steps:
      # 获取源码
      - uses: actions/checkout@v3

      # 步骤名称
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install and Build

        # 当前这一步骤所需要执行的命令
        # 这是需要我们构建，所以 install 和 build 生成产出
        run: |
          npm install
          npm run build

      # 发布
      - name: Deploy

        # 这是使用的一个别人写好的往 gh-pages 发布的 action
        uses: JamesIves/github-pages-deploy-action@releases/v3

        # 配置这个 actions 所需要的参数
        # 整体翻译就是 这个 action 会经过 GITHUB_TOKEN 校验
        # 从 FOLDER 里取出打包完的资源，部署到 BRANCH 上
        with:
          # token 校验
          GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}

          # 需要部署的分支
          BRANCH: gh-pages

          # 需要从 Install and Build 这一步的产文件夹中拿取资源来部署
          FOLDER: docs/.vuepress/dist
```

### 推送代码

至此，github actions 的配置就完成了，接下来就执行 git push origin main 将代码推送至远程分支，即可触发 actions 的构建

构建日志如下，可以点开查看具体的日志，当构建为绿色的时候代表成功，则直接访问 `package.json` 文件中的 homepage 地址即可看到效果：

<img :src="$withBase('/assets/images/github-actions/actions_log.png')">