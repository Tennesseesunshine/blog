---
title: 前端批量导出接口数据方案
date: 2021-06-25 23:35:56
tags: [浏览器, 文件导出]
---

中后台导出数据的需求场景目前已经是非常常见的，所以在个人遇到这个问题的时候，尝试前端解决并且使用的一些方案。

目前总结了下，大致两个方案：要么导出 `excel`，要么导出 `csv`，具体在哪 `node` 层还是浏览器可以看需求以及性能来调整。

## node 配合

这个前提是有 `node` 作为中间层 `node` 层将 `json` 数据转换为流，可以把一些数据在这一层适配，所以一些数据的映射、代码的复用也都可以在这一层，在这一层将 `json` 转为流 `excel`。

思路就是前端发起一个请求，将请求参数给 `node` ，`node` 利用 `axios` 发起多个请求，请求的就是导出数据的接口，但是接口返回的是 `json` 数据，所以在用 `Promise.all` 请求完成数据之后，在服务端利用 `xlsx` 的包将 `json` 数据转为流，前端利用 `blob` 来处理下载。

这里需要注意下：

- `xlsx` 转为表格的时候数据的格式应该是 `[['标题', '生日', '年龄'],['title', 'birthday', 'age'],['title', 'birthday', 'age']...]`，这个数组的第一项就是 `excel` 的表格表头，剩下的项目是请求回来 `json` 数据的每一个需要导出的项。

我们伪代码来演示一下：

### `node` 层

- 主逻辑，因为我们用的是 `thinkjs`，所以按照 `think` 的方式处理参数。

```js
const XLSX = require("xlsx");
async function downloadExcelAction() {
  const EXCEL_TITLE = ["标题", "生日", "年龄"];

  // 实际我们在使用的时候就应该是这样获取数据
  // const params = this.post() // 获取body参数
  // const serviceUrl = this.get('serviceUrl') // 获取get请求参数的实际服务端地址
  // const data = await Promise.all(mapRequestList(serviceUrl, params))

  // 这里可能需要额外做一个处理，data返回的数据格式或许是[[],[],[]]
  // 我们需要处理每一项，promise.all接受的数据应该被打平
  // 即data.flat(2) 或者 flatten(data)

  // 这是一个我们先准备的假数据
  const data = [
    {
      title: "第一个",
      birthday: "1999/01/03",
      age: "23",
    },
    {
      title: "第二个",
      birthday: "2000/12/03",
      age: "20",
    },
  ];

  let xlsxData = [];
  data.forEach((item, index) => {
    const d = [element.title, element.birthday, element.age];

    // 这里不使用push是为了避免数据顺序问题
    xlsxData[index] = d;
  });
  xlsxData = [EXCEL_TITLE, ...xlsxData];

  // 最后我们要生成的表格肯定是这样的一个数据结构 xlsxData 再调用xlsx的api
  const sheet = XLSX.utils.aoa_to_sheet(xlsxData);

  // 获取上下文
  const ctx = this.ctx;

  // excel 转 node 文件流
  const result = sheetToBuffer(sheet);

  // 设置 excel 下载的响应 Content-Type
  const mimeType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  ctx.set("Content-Type", mimeType);
  ctx.body = result;
  ctx.status = 200;
}
```

可以看到，这里我们模拟的数据使用的是一个已经定义好的数组 `data`，但是现实情况肯定是需要向服务端发请求获取数据，所以这里可以利用 `Promise.all` 处理。假设列表页中需要导出数据 `10000` 条，每次请求 `500` 条，需要请求 `20` 次，每次分页偏移量增加 `1`，所以具体的实现伪代码：

- `baseAxiosRequest` 最基本的单元接口请求数据的方法：

```js
const axios = require("axios");

// 这里接受两个参数一个请求地址一个请求参数，请求就是一些分页、偏移量以及别的参数等。
function baseAxiosRequest(serviceUrl, params) {
  return new Promise((resolve, reject) => {
    return axios
      .get(serviceUrl, {
        params,
      })
      .then((result) => {
        // 这里根据自己服务端响应格式，将获取的list[]数据从当前函数返回出去
        const { desc, errorno, data } = result;
        if (errorno === 0) {
          // 这里 return 或者 resolve 的区别可以看上一篇整理
          // [Promise 中的 resolve 和 return 的疑惑](https://tennesseesunshine.github.io/2021/06/13/promiseResolveReturn/)
          return resolve(data);
        } else {
          return reject(desc);
        }
      })
      .catch((err) => {
        return reject(err);
      });
  });
}
```

- `sheetToBuffer` 将数据转为 `buffer` 流数据

```js
function sheetToBuffer(sheetData, sheetName) {
  sheetName = sheetName || "sheet1";
  let workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheetData;

  // excel的配置项
  let wopts = {
    bookType: "xlsx",
    type: "buffer",
  };
  return XLSX.write(workbook, wopts);
}
```

- `flatten` 打平数组

```js
function flatten(arr) {
  return arr.reduce(
    (pre, cur) => [...pre, ...(Array.isArray(cur) ? this.flatten(cur) : [cur])],
    []
  );
}
```

因为要使用 `Promise.all` 所以需要一个 `map` 方法将所有的请求都转为其可以接受的参数形式，如下 `mapRequestList`：

```js
function mapRequestList(serviceUrl, params) {
  // 每页请求数量
  const pageSize = 500;
  // 总分页量，也就是一共发起的请求数
  const pageNumber = 20;
  // 用于存储promise的数组
  let requestArr = [];
  for (let i = 0; i < pageNumber; i++) {
    requestArr[i] = i + 1;
  }
  const att = requestArr.map((pageNumber) => {
    const opts = { ...params, pageSize, pageNumber };
    console.log("发起第" + pageNumber + "个请求");
    return baseAxiosRequest(serviceUrl, opts);
  });
  return att;
}
```

服务端的功能基本上算是完成了，我们来看一下客户端怎么用。

### `web` 请求

这里因为我们用的 `umi-request，axios` 稍微有一点不一样，下文会有说明

```js
import request from "umi-request";
import axios from "axios";
export default function handleExcelExport(data, fileName) {
  // 这里的url拼接，需要请求到node的controller
  const url = `/api/app/toolName/downloadExcel/downloadExcel?serviceUrl=http://yourExportListHost.com/list`;

  request(url, {
    method: "POST",
    data,
    timeout: 300000, // 设置超时虽然5分钟但是后来还是超时
    responseType: "blob",
  })
    .then((response) => {
      const blob = new Blob([response]);
      const elink = document.createElement("a");
      elink.download = `${fileName}.xlsx`;
      elink.style.display = "none";

      // 创建blob url下载
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      // 必须释放 URL 对象
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    })
    .catch((err) => {
      console.log("err", err);
    });

  // axios这里的话有一点细微的区别，是在接口返回响应之后，获取数据转为blob的时候
  axios({
    method: "post",
    url,
    data,
    responseType: "blob",
  }).then((response) => {
    // 区别在这里
    const { data } = response;
    const blob = new Blob([data]);
  });
}
```

在我导出的时候发现几个问题：

- 第一：接口响应时间`比较慢`。单次查询可能会到 `4-7s`，这是因为接口本身问题，数据体量太大，查询耗时长。
- 第二：数据在 `node` 层将 `json` 转为流的时候可能会比较耗算力和内存，我们现在所有的前端都用同一个 `node` 服务，一旦这里单线程耗时比较久的话，可能会因为一系列问题影响到后续的其他工具的接口转发，影响到其他工具的稳定。
- 第三：超时严重，基本无法在超时之前成功导出 `10000` 条数据。

后来在权衡利弊之后，因为数据只是用来看，不会计算以及别的操作，采用在客户端也就是浏览器中导出 `csv` 格式的数据，利用 `excel` 打开是可以满足的，所以就产生了第二中方案。

## 纯前端方案

浏览器分片请求接口，将数据组装为 `csv` 导出，这里我们还是采用方案一中的假数据作为演示

- `exportJsonToCSV` 文件，主体导出方法：

```js
// 在接口响应完成之后，将第i个索引存进去，计算导出进度
let percentArr = [];
const pageSize = 250;
const maxReqCount = 40;

export const exportCsv = (total, queryParams, filename, callback) => {
  return new Promise((resolve, reject) => {
    if (!total) throw "无数据";

    const maxLen = Math.ceil(total / pageSize);

    // 做最大分片处理
    // 正常情况下的 分片请求都是可预知的，如果 你的promise.all 接受的数组
    // 是你无法预料的长度，一定是需要limit最大并发量的，不然可能会造成调用栈溢出
    // 限制最大并发请求数 可以利用p-limit等三方库
    const pageNumber = maxLen >= maxReqCount ? maxReqCount : maxLen;

    // 存储 CSV 数据
    // 注意 csv的存储是以英文,分割的，所以集合类的数据不要用英文逗号分割
    // 每一个,之前的数据在excel里打开就是一个单元格
    // 所以一旦识别出来英文逗号，就会在excel里打开多一个表格，所以最好转为、
    let cvsArray = [];

    const task = new Promise(async (resolve, reject) => {
      try {
        // 创建指定个数的接口数据
        const data = await Promise.all(
          requestMapList(queryParams, pageNumber, callback)
        );

        // data是一个[[],[],[]]格式的数据，拍平一下处理
        // 格式化为 CSV 字符串
        // csv接受的格式是 [0:'a,b,c', 1: 'a1,b1,c1', 2: 'a2,b2,c2']
        data?.flat(2)?.forEach((row, index) => {
          const newRow = [element.title, element.birthday, element.age];

          // 将上一步数据存起来
          cvsArray[index] = newRow.join() + "\n";
        });

        // 创建表头 这里选择在最后再加表头是为了避免 percentArr 存数据的时候干扰
        cvsArray.unshift(EXCEL_TITLE.join() + "\n");

        // 适当暂停，避免页面无法执行渲染
        await new Promise((_resolve) => {
          setTimeout(() => _resolve(true), 50);
        });

        resolve(true);
      } catch (error) {
        reject(false);
      }
    });

    task
      .then((res) => {
        if (res) {
          // 创建blob
          const blob = new Blob([String.fromCharCode(0xfeff), ...cvsArray], {
            type: "text/plain;charset=utf-8",
          });

          createATagTodownload(blob, filename);
          // 完成后将进度数据初始化
          percentArr = [];
          resolve(true);
        } else {
          reject(false);
        }
      })
      .catch((err) => {
        reject(false);
      });
  });
};
```

- `baseRequestData` 基础单元请求接口的方法：

```js
function baseRequestData(params, index, pageNumber, callback) {
  return new Promise((resolve, reject) => {
    return request(SERVICEURL, { params })
      .then((result) => {
        // 根据接口响应格式来处理
        const { desc, errorno, data } = result;
        if (errorno === 0) {
          // 请求完成一次存储一个
          percentArr[index] = index;
          const percentLen = percentArr.length - 1;

          // 计算导出进度
          const percent = Math.ceil((percentLen / pageNumber) * 100);
          // console.log('进度', percent, percentArr);

          // 将计算的数据返回到页面
          callback && callback(percent);
          return resolve(data);
        } else {
          return reject(desc);
        }
      })
      .catch((err) => {
        return reject(err);
      });
  });
}
```

- `requestMapList` 组装请求为 `Promise` 数组

```js
function requestMapList(params, pageNumber, callback) {
  const requestMap = new Array(pageNumber)
    .fill("")
    .map((item, idx) => idx + 1)
    .map((pn, index) => {
      const opts = { ...params, pageSize, pageNumber: pn };
      // console.log('发起第' + pn + '个请求');
      return baseRequestData(opts, index + 1, pageNumber, callback);
    });
  return requestMap;
}
```

- `createATagTodownload` 创建 `a` 标签利用 `blob` 来导出

```js
function createATagTodownload(blob, filename) {
  return new Promise((resolve, reject) => {
    const elink = document.createElement("a");
    elink.download = `${filename || "文件导出"}.csv`;
    elink.style.display = "none";
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 必须释放 URL 对象
    document.body.removeChild(elink);
  });
}
```

- 页面使用，展示实时进度

```jsx
const [loadingPercent, setLoadingPercent] = useState(0);
const [loadingMask, setLoadingMask] = useState(false);

const handleExportFile = () => {
  // 导出按钮使用
  setLoadingMask(true);
  exportCsv(pagination?.total, queryParams, filename, (percent) => {
    setLoadingPercent(percent);
  })
    .then((res) => {
      if (res) {
        setLoadingMask(false);
        setLoadingPercent(0);
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
};

<Modal
  title="数据导出(默认1w条)进度"
  visible={loadingMask}
  width={500}
  maskClosable={false}
  keyboard={false}
  destroyOnClose={true}
  footer={null}
  closable={false}
>
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Progress type="circle" percent={loadingPercent} />
  </div>
</Modal>;
```

导出 `csv` 的格式不会出现超时的问题，`10000` 条数基本会在 `40s` 左右，这其中有一大部分原因是因为接口响应慢，再就是因为同一域名，在浏览器发起请求的时候 `chrome` 会限制 `6` 条，所以方案中采用的导出采用请求 `40` 次，后续的请求肯定是会被挂起等待新的可用连接，比较耗时，具体的就是浏览器 `network` 中的 `Timing` 的 `Connection Start` 的 `Stalled` 时间越往后越长。

所以方案二的话目前是比较可行的一种解决问题的套路。

对于 `Stalled`时间问题，请求静态资源，可以通过域名分片来拆做到多请求，但是对于接口方面的这种情况目前还不知道怎么解决。

一些关于 `stalled` 时间过长的文章

- [关于请求被挂起页面加载缓慢问题的追查（stalled 时间过长）](https://blog.csdn.net/tianhouquan/article/details/78803601)
- [关于心跳 ajax 请求 pending 状态（被挂起），stalled 时间过长的问题](https://blog.csdn.net/WGH100817/article/details/101723517?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.baidujs&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.baidujs)
- [关于请求被挂起页面加载缓慢问题的追查](https://kb.cnblogs.com/page/513237/)
