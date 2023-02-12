---
title: 跨深组件传递数据和调用方法
date: 2021-01-03 10:34:41
tags: react
---

在父子组件传递数据的时候，`react` 最常用的

## 传统简单的组件通信方式

- 父组件 —> 子组件 `props`
- 子组件 —> 父组件 `callback`
  但是有一些特殊的情况，比如是嵌套比较深的组件，`A—>B—>C—>D` 嵌套，一旦这种结果使用 `props` 传递数据，就会显得组件非常臃肿，而 `react` 有提供方式来解决，即 `useContext`

## 嵌套深的组件的通信

- `React.createContext`
- `useContext`

假如现在有依赖关系的，组件 `A->B->C`，`useContext` 使用小结:

可以全局维护一个 `context.ts`

```ts
// 利用 React.CreateContext api 创建一个带有默认值的context

export const CreateContextData = React.createContext('')
```

`A.jsx`
必须要使用 `Provider` 并且将数据以 `value` 的形式传递下去。

```tsx
const A = () => {
  const text = 'react'
  return (
    <CreateContextData.Provider value={text}>
      <B />
    </CreateContextData.Provider>
  )
}
```

`B.jsx`
中间组件不用在意 `A` 往下传递的参数和数据是什么，其只需要保证 `B` 和 `C` 的接口稳定。

```tsx
const B = () => {
  return (
    <div>
      <div>大纲</div>
      <C/>
    </div>
  )
}
```

`C.jsx`
通过获取全局创建的 `context` 对象来获取 `A` 组件的通信数据。

```tsx
import { CreateContextData } from './context.js'

const C = () => {
  // 通过useContext获取context的数据 一定要传入创建的上下文实例 否则获取不到数据
  const initText = useContext(CreateContextData)
  return (<>我正在学习{initText}</>)
}
```

如果嵌套的组件，子组件中也有 `provider` 提供，则按照最近的取值，一般正常的使用方式就是最顶层组件增加 `provider`

每次创建的的上下文实例，都需要导出，所以可以用统一的文件管理这种创建的上下文，最后 `export` 以及在需要的地方 `import`

透传不仅仅可以是 `state`，还可以是父组件的方法，在深层组件获取之后，可以直接修改父组件数据

调用了 `useContext` 的组件总会在 `context` 值变化时重新渲染，如果组件渲染开销太大，可以使用 `useMome` 包装一下
