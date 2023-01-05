---
title: 常用的命令
date: 2022-12-10 16:10:54
tags: [node, shell]
---

22 年下半年接触了很多关于运维的知识，涉及到一些 `shell` 以及 `Node` 的知识点，汇总一下

## Node 中执行 shell

Node 中提供了 `子进程` 的模块，可以利用子进程中的方法来实现系统 linux 命令调用，简单示例：

```js
const { execSync } = require("child_process");
const CMD = "git config --get user.name";
const name = execSync(CMD).toString().trim();
```

以上的代码就类似于，在 zsh 或者命令行终端中执行命令一样，只不过是通过 Node 来执行。

## 传参

首先 shell 可以类似于 Node 执行 js 脚本的时候传参，例如：

- 执行 `node ./index.js jack 20`

index.js

```js
// 获取name和age的参数
const [, , name, age] = process.argv;
```

- 执行 `sh index.sh jack 20`

index.sh

```sh
# $1为第一个参数 "jack"
# $2为第二个参数 "20"
# $n以此类推
```

## 定义变量

```sh
ENABLE_CDN="1"
```

## 条件判断

简单的判断

```sh
if [[ $ENABLE_CDN = "1" ]]; then
    echo "开启"
fi
```

## 导出变量

```sh
export ENABLE_CDN=true

# webpack在依赖Node构建编译的时候，可以通过process.env.ENABLE_CDN来获取变量
# 如果页面组件中需要这个变量，也可以在webpack打包的文件中通过define插件来复制到框架中
```

## 递归创建文件夹

当我们需要在为构建的产出做文件命名空间分割的时候，多层目录`递归创建`

```sh
mkdir -p /output/source/name-space/xx
```

## 移动和复制文件

```sh
mv 源文件 目标文件
cp 源文件 目标文件
```

## 打 tar 包和解压缩包

打包 将当前目录下的 pkg 文件夹打为 pkg.tar.gz

```sh
tar zcvf pkg.tar.gz ./pkg
```

解包 将 pkg.tar.gz 解压到 当前 pkg 目录

```sh
tar zxvf pkg.tar.gz -C ./pkg
```

## 判断文件存不存在

判断当前文件是否存在，不存在则退出

```sh
if [[ ! -f "./index.js" ]]; then
    echo "missing index.js"
    exit 1
fi
```

## 根据文件更新时间排序（倒序）

```sh
ls -lt
```

举个实际的例子：获取当前文件夹下，时间最新的一个 JSON 文件名

```sh
ls -lt | grep '.json$' | head -n 1 | awk '${print $9}'
```

这句话的意思是：先按顺序倒排，然后过滤出来以.json 为后缀的文件，并且去最新的一条，通过 awk 分割获取文件名称

## 获取 JSON 文本数据

假设有个 index.json 文件

```json
{
  "errno": 1,
  "result": "okk"
}
```

实际 shell 是通过 py 来执行和获取 index.json 格式的数据

```sh
RESULT=less ./index.json | python -c "import sys, json; print json.load(sys.stdin)['result']"
```

这里就能得到 index.json 中 result 的结果 `echo $RESULT` -> `okk`

## awk

awk 可以来过滤和处理文本，$1,$2... 可以理解为 awk 按照某一个词作为分割之后的元素，假如有 index 文本

```txt
"楼栋" "单元" "楼层"
12 6 102
3 8 502
```

我们需要组合成 12-6-102 以及 3-8-502 这种格式

```sh
cat ./index | awk -v FS=' ' -v OFS='-' '{print $1,$2,$3}'
```

其中 FS 指定的是分割的符号，默认 FS 为空格，所以以上可以精简为

```sh
cat ./index | awk -v OFS='-' '{print $1,$2,$3}'
```

OFS 是最后需要输出的连接格式，如果只需要后面两位，那就是 {print $2,$3}，并且 awk print 后面可以进行简单的算术运运算

```sh
cat ./index | awk '{print $1+$2+$3}'
```

## 获取其他命令返回值

举个例子，如果我们在 shell 中调用了一段 js 代码，虽然 js 在 node 环境中可以抛出失败或者成功，但是因为不同的进程， shell 无法知道那段程序是否异常或者正常退出，这个时候就需要 shell 拿到 js 执行的结果

index.js

```js
fetch()
  .then((res) => {
    // 程序执行成功退出
    process.exit(0);
  })
  .catch((err) => {
    // 程序执行异常退出
    process.exit(1);
  });
```

sh

```sh
node ./index.js

NODE_RESULT=$?
```

`$?` 就是 js 执行之后的返回值，返回的数据就是 exit 中抛出的状态，当获取到 `$?` 之后，就可以根据上一步的结果来处理下边的逻辑，当上一步执行结果为 1 的时候是异常，此时 shell 也 exit 1 以执行失败退出

```sh
if [[ $NODE_RESULT -eq 1 ]]; then
    echo "node结果执行失败"
    exit 1
fi
```

## 查阅改变的日志文件

用来查阅正在有请求进来的日志文件

```sh
tail -f filename
```

## 以 js 写 shell 脚本的 zx

- 它是一个 js 脚本不是 shell，文件以 .mjs 结尾
- shebang 需要指明为 `#!/usr/bin/env zx`
