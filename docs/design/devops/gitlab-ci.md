---
title: gitlab-ci
---

## 基础抽象概念

### `runner`

用来执行软件集成脚本的东西，`runner` 的机器是需要能够通过网络访问 `GitLab` 服务器

- `Shared Runner` 场景：所有的工程都有可能需要在公司的服务器上进行编译、测试、部署等工作，这个时候注册一个`Shared Runner`供所有工程使用就很合适
- `Specific Runner` 场景：个人的电脑或者服务器上自动构建我参与的某个工程，这个时候注册一个 `Specific Runner` 就很合适

### `pipleline`

一整个工作流

### `stage`

一整个工作流是由于多个 `stage` 组成

- 如果两个任务对应的 `stage` 名相同，则这两个任务会并行运行
- 下一个 `stage` 关联的任务会等待上一个 `stage` 执行成功后才继续运行，失败则不运行

### `job`

每一个 `stage` 由至少一个 `Job` 组成

### `image`

镜像 指定一个任务 `（job）` 所使用的 `docker` 镜像

### `only / except`

当符合定义的策略时才会触发 `Pipelines` 的执行，`except` 则相反。

### `variables`

定义变量

## `.gitlab-ci.yml` 示例说明

```yml
stages:
  # 先定义几个阶段 
  # 在yml加载完成之后就会在pipeline里出现三个stages stage的名称
  # 是下边开始的最前边的名称 [ stage: assemble、stage: deploy、stage: success]
  - assemble
  - deploy
  - success

  # stage的名称
name1:
  # 对应第一个需要处理的阶段
  stage: assemble
  # 需要在assemble的时候运行的脚本 `linux` 的命令
  script:
    - ls -la
    - rm -rf node_module
    - pwd
name2:
  stage: deploy
  # 依赖项目
  dependencies:
    - name1
  # 需要在deploy的时候运行的脚本
  script:

name3:
  stage: success
  # 依赖项目
  dependencies:
    - name2
  # 需要在success的时候运行的脚本
  script:
```
