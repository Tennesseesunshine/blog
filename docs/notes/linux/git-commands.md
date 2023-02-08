---
title: 日常git命令总结
date: 2020-09-15 22:26:53
tags: git
---

在工作中结合 vscode 会非常便利。

## 生成 sshkey

- `ssh-keygen -t rsa -C "邮箱"`
- `cd ~/.ssh` 复制 `id_rsa.pub` 内容复制到 `git` 库中

## 配置信息以及查看

### 查看配置信息

- `git config --list`

### 全局配置

- `git config --global user.name "yourname"`
- `git config --global user.email "your_email"`

### 在不同 `.git` 文件下 `config` 中设置不同的局部变量

- `git config  user.name "name"`
- `git config  user.email "email"`

## 常用的基本操作

### 初始化创建 `.git`

- `git init -y` 加参数可以跳过填写信息

### 添加本地已有文件到 `git` 远程仓库

- `git remote add origin xxxx.git`

### 查看分支

- `git branch` 当前本地分支
- `git branch -a` 查看所有分支【本地+远程】

### 更新远程分支到本地分支

- `git checkout -b <localBranch> origin/<remoteBranch>` 更新远程分支 `remoteBranch` 在本地的 `localBranch` 分支上

### 临时存储

开发了一半还没完成突然线上出现了紧急问题，这个时候工作区未清空的状态下 `git` 不允许签出和签入，此时不想 `commit` 的话，就要用到以下命令

- `git stash` 将目前的改动存储起来
- `git stash list` 查看 `stash` 了哪些
- `git stash apply` 如果要使用其他个，`git stash apply stash@{$num}` `num` 从 `0` 开始 结合 `vocode` 可以点击对应的就可以应用
- `git stash clear` 清除掉 `stash`

### 切换分支

- `git checkout <branch>`

### 若想基于当前分支拉出来一个新的分支

- `git checkout -b <newBranch>`
- 推送到远程仓库 `git push origin <newBranch>`

### 删除本地和远程分支

- `git branch -d <branch>` 有时候不生效可能需要换成 `-D`
- `git push origin --delete <branch>`

### 查看状态、将文件添加到缓冲区、提交到本地仓库

- `git status`
- `git log`
- `git reflog` 相比 `git log` 它每一步操作都能看到（ `.git` 下的 `refs` 目录存储指向数据（分支、远程仓库和标签等）的提交对象的指针，所以猜测 `git reflog` 基本上跟 `refs` 有关）
- `git add . | git add fileName`
- `git commit -m "msg"` `-m` 参数表示可以直接输入后面的 `message`
- `git commit -a -m "msg"` 相当于执行了 `git add . + git commit -m "msg"`

### 重置提交信息

- `git commit --amend` `git push` 的时候需要校验 `message` 格式，如果第一次写错的话就无法 `push` 到远程仓库，可以用这个修改提交的 `message` 重新 `push`

### `pull` 不下代码的情况

- `git pull origin <branch>` 偶尔会遇到服务器上的代码一直 `pull` 不下来，可以加上 `origin <branch>`

### 合并

- 个人习惯和原则：所有本地改动均已经推送到远程分支的前提
- `git merge <branch>` 将 `branch` 分支合并到当前分支
- 简单的合并出现冲突，用 `vscode` 解决掉冲突，重新`add 、commit、
push` 就可以，但是一些有时候出现一些比较复杂的冲突导致合并失败，再次操作的时候会提示当前正在处于合并之中（分支名后带着｜`MERGING`），需要 `git merge --abort` 选项会尝试恢复到你运行合并前的状态
  如果已经合并发现合并错分支（所以合并的东西是不需要保留在工作空间的），可以使用 `git reset --hard HEAD~` 来还原到未合并之前，并且工作区是干净的状态
- 合并中出现 `Swap file .MERGE_MSG.swp already exists` 的情况需要打开当前项目 `.git` 文件删除 `.MERGE_MSG.sw*` 文件，再继续操作

### 重置

- `git reset --(soft | mixed | hard ) < HEAD ~(num) > |`
- 用的比较多的是 `soft` 和 `hard`
- 跟时间旅行一个道理，`git reset HEAD` 跟着 `HEAD@{1}(HEAD~) HEAD@{2}...` 或者分支的 `hash` 值可以将本地存储库切换到任意的版本
- 一种场景如果需要回退到某一次版本，并且不要那些版本的改动文件，可以使用 `git reset --hard HEAD`【硬回退】这个命名回回退到指定的版本并且删掉之前的改动文件，不会出现在暂存区。如果想回退到某次版本，并且需要暂存区看到改动的文件可以使用 `git reset --soft HEAD`【软回退】
- 回退到某个之前的版本的话， 需要 `git push origin <branch> --force` 推送到远程分支

### 推送

- `master` 分支推送可以直接使用 `git push`
- 非 `master` 分支需要加上 `origin <remoteBranch>` 即：`git push origin remoteBranch`

### 不是很常用的几个 `git` 命令

- `git fetch` 有时候不需要合并的时候会用一下，`git fetch` 和 `git pull` 的区别就是 `git pull = git fetch + git merge`

- `submodule` 的命令
  - `git submodule init`
  - `git submodule foreach git submodule update`
  - `git submodule update --init`
