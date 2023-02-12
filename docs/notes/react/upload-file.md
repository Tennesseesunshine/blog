---
title: node中间层文件上传
date: 2021-01-01 20:56:00
tags: react
---

## 背景

公司项目的架构是 `umi` —>  `nodejs` —> `api`

在最近一次的需求中，有一个批量上传的功能，大体的交互是：在 `excel` 里先填写好数据，`web` 通过上传文件来在页面表格里预览，然后再将 `excel` 文件绑定一些表单的数据一起打包发送给后台，有点类似于表单中嵌套了文件上传，最后再提交表单。

## 一些想法和对交互的调整

最初的页面设计是放在步骤条里一共分为三步。上传在步骤条的第一步，表单在第二步，`ant-design` 的步骤条在切换上下步骤之后，上一个组件的 `dom` 会销毁，导致第二步无法获取到第一步在上传的时候生成的文件对象，也就无法上传文件。于是后来调整页面，将表单和上传文件放在一个页面，这样在解析文件成功之后，在当前这一步里就能一直获取到文件的对象，拿到文件对象就可以向接口发起请求。

## 未使用 `ant-design` 上传组件的原因

`ant-design` 的 `Upload` 组件上传之后的文件对象会立马返回，但是前端无法将这个对象一直拿着在提交的时候再给接口，因为文件对象的一些 `key` 不能拷贝过去【也是这次才发现只有 `uid` 一个字段可以遍历】，而且在通过 `document.getElementById('file').files` 获取上传的文件对，其 `FileList` 是 `{length: 0}`，所以后来选择利用原生 `input` 来解决问题，通过创建 `ref` 将 `input` 的 `dom` 属性存起来，然后将 `ref` 获取的属性返回到父组件，在父组件里提交的时候，获取 `ref` 中的文件对象，传递给接口。

## 具体思路

- 创建 `ref` 对象来存储 `input` `dom` 属性
- 初始化利用 `addEventListener` 来监听原生 `input` 的 `change` 事件
- 利用 `button` 覆盖默认的上传样式，点击 `button` 的时候模拟触发点击 `input` 上传
- 捕获到事件之后，成功获取到文件对象，依次将文件对象传递给 `xlsx` 来解析为 `json` 数据，再将 `json` 数据传递给 `and-table` 来显示预览、将 `input` 的 `ref` 属性值回传到父组件（`handleFileInputRefs` 方法是父组件传递的 `props` 来获取自组件的 `input ref`）
- 父组件中也已经接受了表单的数据，并且接受了 `input` 的属性，通过 `FormData` 将数据和文件混传给 `node` 的 `controller`
- `controller` 获取到文件对象和额外的表单参数，再向真正的接口发起请求

## 伪代码

### 前端

子组件 `parseExcel.tsx`

```jsx
const ONE_M_TO_BYTES: number = 1024 * 1024;
const MAX_FILE_SIZE: number = 10;

// 初始化定义ref来存储input dom对象，这个对象里的files对象可以一直获取到
const uploadInput = useRef(null);

/**
 * 获取column的对象key，数组转对象
 * tableColumnKey 是父组件传递回来的table的json，类似
 *
 * [{
 *    title: '关键词',
 *    dataIndex: 'word',
 *    key: 'word',
 *  },
 *  {
 *    title: '豁免词',
 *    dataIndex: 'exWord',
 *    key: 'exWord',
 *  }]
 */
const formatTitleOrFileld = () => {
  const entozh = tableColumnKey.map((item, index) => {
    return {
      index,
      key: item.key,
    };
  });
  return entozh;
};

/**
 * 这个方法其实就是将数据转为表格可以用的json
 */
const handleImpotedJson = () => {
  const [header, ...tableBody] = jsonArr;
  const keysArr = formatTitleOrFileld();
  const len = header.length;

  // 稀疏数组补全empty项，因为excel中有的数据是空，解析出来的数据是索引不连续的，这一步的目的就是补全index
  tableBody.forEach((item: any) => {
    for (let i = 0; i <= len - 1; i++) {
      item[i] = item[i] || '';
    }
  });

  /**
   * 将解析的excel数据转换为ant-table支持渲染的数据格式
   */
  const parsedExcelData = tableBody.map((ele: any) => {
    const newitem = {};
    ele.forEach((im: any, i: number) => {
      const newKey = keysArr[i].key;
      newitem[newKey] = im;
    });
    return newitem;
  });
}

/**
 * 上传文件的方法，主要做一些文件大小的判断、文件的读取将excel的数据转换为json
 * 这里有一个比较重要的方法是，解析完成的json数据，实际上是没有key的
 * 表格在展示的时候需要key对应上，value才会在表格里显示，所以需要调方法处理一下
 */
const beforeUpload = (file: any) => {
  if (file.size / ONE_M_TO_BYTES > MAX_FILE_SIZE) {

    message.warning('请上传小于10M的文件！');
    return false

  } else {

    const f = file;
    const reader = new FileReader();

    reader.onload = function(e) {
      const datas = e?.target?.result;
      // 解析datas
      const workbook = XLSX.read(datas, {
        type: 'binary',
      });

      // 是工作簿中的工作表的有序列表
      const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // 将工作簿对象转换为JSON对象数组
      const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });

      handleImpotedJson(jsonArr);
    };

    reader.readAsBinaryString(f);
  }
};

// 在事件监听文件的change的回调函数中，获取到文件对象之后调用方法来将excel数据解析为json
const handleUpload = () => {
  beforeUpload(uploadInput?.current?.files[0]);
};

// 点击按钮的时候，触发input的上传click事件
const handleFakeUpload = () => {
  uploadInput?.current?.click();
};

useEffect(() => {
  if (document) {
    /**
      * 监听input上传事件 在得到文件流之后 把input的ref回传到父组件
      * 并且解析文件转为json来在表格里显示
      */
    document.querySelector(`[name=uploadExcel]`)!.addEventListener('change', function(event) {
      if (event?.target && event?.target?.files) {
        handleFileInputRefs && handleFileInputRefs(uploadInput);
        handleUpload();
      }
    });
  }
}, []);

return (
  <div className="fix-input-button">
    <input type="file" name="uploadExcel" ref={uploadInput} />
    <Button icon={<Iconfont name="iconshangchuan" />} onClick={handleFakeUpload}>
      上传
    </Button>
  </div>
)
```

父组件

```jsx
// uploadRefs 是useState定义的保存ref的变量

const formData = new FormData();

formData.append('fileStream', uploadRefs?.current?.files[0]);
// 接口还需要一些别的参数
formData.append('connectBusiness', JSON.stringify(connectBusiness));
/**
  * 这里不能设置请求头
  * 浏览器检测到后自己加上 Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXXx 这样
  */
setIsLoading(true)
fetch('/api/appName/parseExcelUpload', {
  method: 'post',
  body: formData,
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log('err', err);
  })
  .finally(() => {
    setIsLoading(false);
  });
```

### `node` 层

`node` 用的是 `thinkjs`，`controller` 其实很简单，包装一下然后请求真正的接口避免直接调接口跨域

伪代码：

```js
const Base = require('../base');
const fs = require('fs');
const request = require('request');

const UPLOAD_SERVICE = 'http://xxx';

module.exports = class extends Base {

  constructor(props) {
    super(props)
  }

  async parseExcelUploadAction() {

    // 获取文件信息
    const files = this.file('fileStream');

    // 利用request发起请求
    var req = request.post(UPLOAD_SERVICE, function (err, resp, body) {
      if (err) {
        this.json({
          status: 'failed',
          msg: `上传失败，url:${UPLOAD_SERVICE}`
        })
      } else {
        this.json({
          status: 'success',
          data: body
        })
        console.log('返回请求' + body);
      }
    });

    var form = req.form();

    // request上传文件的时候需要append一些stream和string
    // node也会自己获取前端上传发起请求的头 Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXXx
    form.append('file', fs.createReadStream(files.path), {
      filename: files.name,
      contentType: 'application/vnd.ms-excel'
    });

    form.append('connectBusiness', JSON.stringify(this.post('connectBusiness')));
  }
};

```

至此通过 `node` 中间层来上传的一个功能实现了。
