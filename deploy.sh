#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

export NODE_OPTIONS=--openssl-legacy-provider

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'update blog'

cd -

node ./publish.js
