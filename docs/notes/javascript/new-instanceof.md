---
title: 实现 new 和 instanceof
date: 2021-03-06 20:32:37
tags: JavaScript
---

记录一下自己理解的 `new` 和 `instanceof`，实现一遍加深理解和记忆。

## `new` 操作符

先从一个例子中看 `new` 操作符做了什么

```js
function Person(name) {
  this.name = name
}

// 为构造函数原型上增加一个方法
Person.prototype.say = function () {
  console.log(`${this.name}已经吃了晚饭🥣`)
}

const personName = new Person('张三')

personName.name // 张三
personName.say() // 张三已经吃了晚饭🥣

personName.__proto__ === Person.prototype // true
Object.getPrototypeOf(personName) === Person.prototype // true
```

分析：首先实例的 `.` 访问的特性可以知道 `new` 最终 `return` 的是一个对象的类型，因此需要做一个判断，如果原来构造函数有 `Object` 类型的返回值，我们是不可以动的，也就是需要直接返回，如果不是 `Object` 类型的类型的话就要返回我们所创建的对象，所以必须先创建一个空的对象，作为在原来构造函数没有 `Object` 类型的情况下的返回值。然后发现实例具有一些可以访问构造函数的 `prototype` 的能力，而且是具有参数的绑定，并且我们知道实例的 `__proto__` 等于构造函数的 `prototype`。

大概实现应该如下：

```js
function myNew(Fn, ...args) {
  // 创建以备返回的空对象
  const obj = {}
  // 进行原型关系以及参数的绑定
  obj.__proto__ = Fn.prototype
  // 或者 Object.getPrototypeOf(obj) = Fn.prototype

  const result = Fn.apply(obj, args)

  const isObject = typeof result === 'object' && result !== 'null'

  return isObject ? result : obj 
}
```

验证一下正确性：

```js
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(`${this.name}已经吃了晚饭🥣`)
}

const personName = myNew(Person, '莉莉丝')
personName.name // 莉莉丝
personName.say() // 莉莉丝已经吃了晚饭🥣

personName.__proto__ === Person.prototype // true
Object.getPrototypeOf(personName) === Person.prototype // true
```

## `instanceof` 操作符

我们都知道 `instanceof` 操作符是可以判断一个数据的类型，但是只能判断非简单的数据类型，继续以一个例子来看。

```js
const obj = {
  name: '张三'
} // new Object
const arr = ['张三'] // new Array
const time = new Date()

obj instanceof Object // true
obj instanceof Date // false
arr instanceof Array // true
time instanceof Date // true
```

分析：可以从上面的例子发现，操作符右边的就是构造函数，左边就是构造函数的实例，而构造函数和实例之间的关系即就是 `instance.__proto__ === Fn.prototype`，但是根据作用域链的就近原则不能保证就近能找到对应的关系链所以必须要一步一步往原型链上找，找到的话就可以返回 `true`，我们知道原型链的顶端为 `null`，当为 `null` 的时候即没找到应该返回 `false`。

具体实现：

- 迭代版

```js
function myInstanceof(left, right) {
  
  // 根据 instanceof 的特性可以知道，基本数据类型应该直接返回false
  const isObject = typeof left === 'object' && left !== 'null'
  if(!isObject) {
    return false
  }

  let proto = Object.getPrototypeOf(left)
  // 或者 let proto = left.__proto__

  while(true) {
    // 一直查找到原型链的顶端
    if(proto == null) {
      return false
    }

    // 即 instance.__proto__ === Fn.prototype
    if(proto == right.prototype) {
      return true
    }

    // 每次循环都将值重新设置
    proto = Object.getPrototypeOf(proto)
    // 或者 proto = proto.__proto__;
  }
}
```

- 递归版

```js
function myInstanceof(left, right) {
  return left !== null && (Object.getPrototypeOf(left) === right.prototype || myInstanceof(left, right))
}
```

验证：

```js
var obj1 = {
  name: '张三'
} // new Object
var arr1 = ['张三'] // new Array
var time1 = new Date()

console.log(obj1 instanceof Date, arr1 instanceof Array, time1 instanceof Date)
// false true true
```
