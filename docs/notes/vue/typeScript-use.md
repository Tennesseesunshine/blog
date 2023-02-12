---
title: TypeScript 工具类型使用总结
date: 2020-11-22 22:22:05
tags: TypeScript
---

```ts
interface IMyInfo {
  name: string
  age: number
  address: string
  money: number
}

type BasicSelect = 'name' | 'age'
```

### `keyof`

- 该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。
- 例如：

```ts
type koT = keyof IMyInfo

// type koT = "name" | "age" | "address" | "money"
```

### `typeof`

- `typeof` 操作符可以用来获取一个变量声明或对象的类型

```ts
type naBasicT = 'name' | 'age'

// 从T中选择出K的类型作为当前变量的类型
const naData: Pick<IMyInfo, naBasicT>  = {
  name: 'sss',
  age: 1
}

type naT = typeof naData

// 等价于 
// type naT = {
//   name: string;
//   age: number;
// }
```

### `in`

- 遍历枚举类型或判断在不在某一个类型中

```ts
type Keys = "a" | "b" | "c"

type Obj =  {
  [P in Keys]: string
}

// { a: string, b: string, c: string }

```

### `extends`

- 理解为约束比较好

```ts
type Len = {
  length: number
}

// 利用Len类型来约束T使其具有length的类型
function getLen<T extends Len> (arg: T) {
  return arg.length
}
```

### `Pick`

- `Pick<T, K>` `K`可以是一个联合类型 从泛型`T`中过滤出`K`联合的类型，第一个参数是基准，第二个参数是需要选择出来的类型的联合，或者单个类型

```ts
type pickT = Pick<IMyInfo, BasicSelect>

// 等价于 type nameT = {
//   name: string;
//   age: number;
// }
```

### `Partial`

- `Partial<T>` 将`T`都变为可选类型

```ts
type partialT = Partial<IMyInfo>
```

### `Required`

- `Required<T>` 将传入的泛型变为必选项

```ts
type requiredT = Required<partialT>
```

### `Readonly`

- `Readonly<T>` 将泛型变为 `readonly`

```ts
type readonlyT = Readonly<IMyInfo>
```

### `Record`

- `Record<K, T>` 将`T`的类型赋给每一个`K`

```ts
type recodeT = Record<BasicSelect, IMyInfo>

// 等价于
// type recodeT = {
//   name: IMyInfo;
//   age: IMyInfo;
// }
```

### `Exclude`、`Extract`

- `Exclude<T, U>` 其中 `T`，`U` 比较，排除`U`和`T`中共有，返回`T`中剩下的 返回的是第一个泛型 第一个作为基准

```ts
type T1 = 'a' | 'b' | 'c' | 'm'
type T2 = 'b' | 'c' | 'd'

type excludeT = Exclude<T1, T2>
// 等价于 type excludeT = "a"

type extractT = Extract<T1, T2>
// 等价于 type extractT = "b" | "c"
```

### `Omit`

- `Omit<T, K>` 跟`Pick`类似，但是功能相反 从`T`中排除掉`K`的类型

```ts
type omitT = Omit<IMyInfo, 'age'>

// 等价于
// type omitT = {
//   name: string;
//   address: string;
//   money: number;
// }
```

### `ReturnType`

- 从函数的返回值中提取类型

```ts
function userinfo () {
  return {
    age: 25,
    name: 'jack'
  }
}

type ObjT = ReturnType<typeof userinfo>

// 等同于 type ObjT = {
//   age: number;
//   name: string;
// }
```

### `Parameters`

- 从函数的参数中提取出需要的类型

```ts
// 定义的参数类型是 string, number
type fnT = {
  (name: string, age: number): {
    breif: string
  }
}

type TParams = Parameters<fnT>
// type TParams = [string, number]

function getInfo (name: TParams[0], age: TParams[1]) {}
```
