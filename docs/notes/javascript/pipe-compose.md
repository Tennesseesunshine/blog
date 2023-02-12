---
title: pipe 和 compose 函数
date: 2021-01-17 20:46:37
tags: JavaScript
---

函数式编程的中从左往右的 `pipe` 函数和从右往左的 `compose` 函数，在 `js` 中的一些应用场景。

## pipe

也称为管道函数，它接受 `n` 多个函数，依次从左往右执行，用最后一个函数作为最终的输出。用于改善函数嵌套调用，一个简单的示例：

```js
function first (params) {
  return `我是第一个函数，我获取我的参数「${params}」并且返回`
}
function second (params) {
  return `我接受了第一个函数的返回值「${params}」，作为我的参数，然后和我的数据拼接再返回`
}
function end (params) {
  return `我是最后的数据的拼接处理，结合了first函数和second的返回值「${params}」`
}

end(second(first(`hi～我来了！💐`)))
```

最终返回： "我是最后的数据的拼接处理，结合了 `first` 函数和 `second` 的返回值「我接受了第一个函数的返回值「我是第一个函数，我获取我的参数「`hi` ～我来了！💐」并且返回」，作为我的参数，然后和我的数据拼接再返回」"

能看到的是，函数之间形成一种关系，即后一个函数接受上一个函数的返回值作为参数，本例中也就是 `end` 函数接受 `second` 的返回值作为参数，而 `second` 的返回值又是接受 `first` 的返回值作为参数。

其实能看到 `end(second(first()))`这么调用嵌套不直观，我们用`reduce`实现管道 `pipe` 依次调用。

优化之后的结果：

```js
const pipe = (...arg) => result => arg.reduce((res, callback) => callback(res), result)
```

调用

`pipe(first, second, end)('hi ～我来了！💐')`

会将参数先传递给 `first`，然后处理成功之后，再将结果作为 `second` 的参数，传递，`second` 处理完成之后，将结果作为 `end` 函数的参数，在 `end` 函数处理完成之后，将所有结果返回。最终 `pipe` 函数调用的结果，将会上边函数嵌套执行的结果一致。

## compose

组合函数和 `pipe` 原理都是一样的，只不过是其调用顺序是从右往左。

组合函数在 `webpack` 的 `loader` 中也有应用，本例中的 `pipe` 是从左往右依次执行，`webpack` 的 `loader` 是从右向左执行（`compose）`，其实可以利用 `reduceRight` 实现。

```js
const compose = (...arg) => result => arg.reduceRight((res, callback) => callback(res), result)
```

这里的话，如果上述的例子是通过 `compose` 函数来实现的话，应该是 `compose(first, second, end)('hi ～我来了！💐')`，最外边的参数应该先是给 `end` 函数，处理完成之后再给 `second`，最终给 `first`，由 `first` 处理，最终返回结果。

## 总结

如果一个数据最终结果，是需要经过很多函数的处理，并且那些函数，需要用上一个函数的返回值作为下一个函数的参数，这种场景下可以考虑使用 `pipe` 或者 `compose` 函数来处理，其实使用 `pipe` 或者 `compose` 都是可以的，只需要保证传入的函数的顺序是按照数据正确执行的函数顺序即可。
