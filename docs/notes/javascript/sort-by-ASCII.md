---
title: 实现电话簿或者昵称分类功能 ☎️
date: 2021-05-14 22:26:23
tags: JavaScript
---

最近有一个挺有意思的小需求，有一组词的分类需要按照拼音归类且排序，基本类似于电话薄按照英文字母排序的功能。

假如后端给出的数据是

## 原始数据

```json
[
  {
    "tag": "感动",
    "pinyin": "gan dong"
  },
  {
    "tag": "爱国",
    "pinyin": "ai guo"
  },
  {
    "tag": "感动中国",
    "pinyin": "gan dong zhong guo"
  },
  {
    "tag": "富强",
    "pinyin": "fu qiang"
  }
]
```

最终需要将数据转为

## 目标数据

```json
[
  {
    "letter": "a",
    "data": ["爱国"]
  },
  {
    "letter": "f",
    "data": ["富强"]
  },
  {
    "letter": "g",
    "data": ["感动", "感动中国"]
  }
]
```

实现思路，可以借助 `Map` 的属性，先查看当前的数据是否已经被推入 `data` 中，如果已经被推入则需要更新，否则直接 `push` 到 `data` 中，并且跟新 `Map` 的状态。

## 实现

```ts
type tagsTypes = 'tag' | 'pinyin'

interface IResult {
  letter: string;
  data: string[];
}

const pySegSort = (arr: Record<tagsTypes, string>[]) => {
  let wordsMap: Map<string, boolean> = new Map();
  let moreWords: IResult[] = [];
  arr.forEach((item) => {
    // 取首字母
    const initials = item.pinyin.charAt(0).toLowerCase();
    // 若Map中不存在，直接push，并且更新状态
    if (!wordsMap.has(initials)) {
      moreWords.push({
        letter: initials,
        data: [item.tag],
      });
      wordsMap.set(initials, true);
    } else {
      // 否则就寻找去拼接
      moreWords.forEach((e) => {
        if (e.letter === initials) {
          e.data = [...new Set([...e.data, item.tag])];
        }
      });
    }
  });
  // 最终取数据的首字母的ASCII码排序
  return moreWords.sort(
    (a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0)
  );
};
```
