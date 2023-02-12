(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{320:function(t,s,a){"use strict";a.r(s);var n=a(10),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("重学 "),s("code",[t._v("webpack")]),t._v(" 之后，对 "),s("code",[t._v("webpack")]),t._v(" 的理解又上了一个层次，"),s("code",[t._v("webpack")]),t._v(" 的 "),s("code",[t._v("loader")]),t._v(" 作为其一个非常重要的链路，能用自定义的 "),s("code",[t._v("loader")]),t._v(" 来处理日常工作中遇到的问题俨然已经成为了一个前端工程师的基本素养，所以最基本的要求就是能够手写自定义的 "),s("code",[t._v("loader")]),t._v("。")]),t._v(" "),s("p",[s("code",[t._v("webpack")]),t._v(" 自身只能够处理 "),s("code",[t._v("JS")]),t._v(" 和 "),s("code",[t._v("JSON")]),t._v(" 文件，而作为非此二者的其他文件，"),s("code",[t._v("webpack")]),t._v(" 也是支持其作为模块通过 "),s("code",[t._v("import、export、export.default")]),t._v(" 等，所以在对这些文件处理的时候，就需要对应的一些 "),s("code",[t._v("loader")]),t._v(" 来解析，例如在项目中使用 "),s("code",[t._v("sass")]),t._v("，那肯定是不能缺少解析 "),s("code",[t._v("sass")]),t._v(" 的 "),s("code",[t._v("loader")]),t._v("。使用 "),s("code",[t._v("ts")]),t._v(" 少不了 "),s("code",[t._v("ts-loader")]),t._v(" 等等。")]),t._v(" "),s("p",[t._v("而且 "),s("code",[t._v("loader")]),t._v(" 在 "),s("code",[t._v("webpack")]),t._v(" 中是可以进行串联调用，从其从后往前或者从右往左的顺序可以知道，"),s("code",[t._v("webpack")]),t._v(" 采用的是 "),s("code",[t._v("compose")]),t._v(" 的方式来在下一个 "),s("code",[t._v("loader")]),t._v(" 中结合上一个 "),s("code",[t._v("loader")]),t._v(" 处理完的结果。其实在这种串联组合中的 "),s("code",[t._v("loader")]),t._v(" 并不一定要返回 "),s("code",[t._v("JS")]),t._v(" 代码。只要下游的 "),s("code",[t._v("loader")]),t._v(" 能有效处理上游 "),s("code",[t._v("loader")]),t._v(" 的输出，那么上游的 "),s("code",[t._v("loader")]),t._v(" 可以返回任意类型的模块。")]),t._v(" "),s("p",[t._v("今天的任务是写一个，将 "),s("code",[t._v("markdown")]),t._v(" 转为 "),s("code",[t._v("html")]),t._v(" 的 "),s("code",[t._v("loader")]),t._v("。")]),t._v(" "),s("h2",{attrs:{id:"依赖分析"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#依赖分析"}},[t._v("#")]),t._v(" 依赖分析")]),t._v(" "),s("p",[t._v("先分析一下构建这些， "),s("code",[t._v("webpack")]),t._v(" 工具需要哪些东西，首先肯定需要 "),s("code",[t._v("webpack")]),t._v(" 和 "),s("code",[t._v("webpack-cli")]),t._v(" 作为最基础的依赖，然后需要 "),s("code",[t._v("marked")]),t._v(" 将 "),s("code",[t._v("md")]),t._v(" 文件转为 "),s("code",[t._v("html")]),t._v("，而且即便很简单的 "),s("code",[t._v("loader")]),t._v("，我们仍然需要一个 "),s("code",[t._v("CleanWebpackPlugin")]),t._v(" 和 "),s("code",[t._v("HtmlWebpackPlugin")]),t._v(" 作为在打包之前和成功之后最底层的支持，一个用于清除打包结果，一个用于生成打包后的 "),s("code",[t._v("html")]),t._v(" 文件。所以我们汇总一下需要安装的几个依赖，分别是：")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("- webpack\n- webpack-cli\n- marked\n- CleanWebpackPlugin\n- HtmlWebpackPlugin\n")])])]),s("h2",{attrs:{id:"创建对应的文件夹、文件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#创建对应的文件夹、文件"}},[t._v("#")]),t._v(" 创建对应的文件夹、文件")]),t._v(" "),s("p",[t._v("首先我们需要利用 "),s("code",[t._v("npm")]),t._v(" 自动生成一个 "),s("code",[t._v("package.json")]),t._v(" 文件：")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("npm init -y\n")])])]),s("p",[t._v("紧接着，我们在根目录下创建一个 "),s("code",[t._v("src")]),t._v(" 文件夹、"),s("code",[t._v("loader")]),t._v(" 文件夹以及其子文件 "),s("code",[t._v("md2html-loader.js")]),t._v(" 和 "),s("code",[t._v("webpack.config.js")]),t._v(" 文件，并且在 "),s("code",[t._v("src")]),t._v(" 下创建 "),s("code",[t._v("index.md、main.js")]),t._v("，成功之后我们的文件夹目录应该是：")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("+ src\n  - index.md\n  - main.js\n+ loader\n  - md2html-loader.js\n- package.json\n- webpack.config.js\n")])])]),s("h2",{attrs:{id:"安装依赖"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#安装依赖"}},[t._v("#")]),t._v(" 安装依赖")]),t._v(" "),s("p",[t._v("我们利用 "),s("code",[t._v("cnpm")]),t._v(" 一次性将所需要的依赖全部安装完成。")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("cnpm install --save-dev html-webpack-plugin webpack webpack-cli marked clean-webpack-plugin\n")])])]),s("p",[t._v("我们看看下载成功之后的依赖分别都是什么版本。发现 "),s("code",[t._v("clean-webpack-plugin")]),t._v(" 是 "),s("code",[t._v("3.0.0")]),t._v("，在使用的时候我们需要解构出构造函数从而实例化，否则 "),s("code",[t._v("webpack")]),t._v(" 会抛出"),s("code",[t._v("TypeError: CleanWebpackPlugin is not a constructor")]),t._v("的错误。")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("package.json")])])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"devDependencies"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"clean-webpack-plugin"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"^3.0.0"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"html-webpack-plugin"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"^4.5.1"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"marked"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"^1.2.7"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"webpack"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"^5.17.0"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"webpack-cli"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"^4.4.0"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"编写文件内容"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#编写文件内容"}},[t._v("#")]),t._v(" 编写文件内容")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("index.md")])])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("# 今天是 2021 年，开始认真工作的一天\n\n这是一个段落\n\n- 这是第一项\n- 这是第二项\n\n这是一段落`code`\n\nconst a = 'webpack-demo'\nconsole.log('a', a)\n")])])]),s("ul",[s("li",[s("code",[t._v("main.js")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" md "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./index.md"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"md"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" md"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("ul",[s("li",[s("code",[t._v("md2html-loader.js")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("exports")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("source")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"source"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" source"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"source"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("ul",[s("li",[s("code",[t._v("webpack.config.js")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" webpack "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"webpack"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" path "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"path"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" HtmlWebpackPlugin "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"html-webpack-plugin"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" CleanWebpackPlugin "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"clean-webpack-plugin"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 增加Configuration是为了配置的key提示")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * @type {webpack.Configuration}\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" config "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("entry")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./src/main.js"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("output")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("filename")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"bundle.js"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("join")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"dist"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("mode")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"development"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("module")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("rules")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("test")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token regex"}},[s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("\\.md$")]),s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./loader/md2html-loader.js"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugins")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CleanWebpackPlugin")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HtmlWebpackPlugin")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nmodule"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("在终端输入 "),s("code",[t._v("npx webpack")]),t._v(" 之后运行，我们能够发现，打印出了我们 "),s("code",[t._v("loader")]),t._v("文件里打印的 "),s("code",[t._v("source")]),t._v(" 的内容，如下：")]),t._v(" "),s("hr"),t._v(" "),s("p",[t._v("source # 今天是 2021 年，开始认真工作的一天")]),t._v(" "),s("p",[t._v("这是一个段落")]),t._v(" "),s("ul",[s("li",[t._v("这是第一项")]),t._v(" "),s("li",[t._v("这是第二项")])]),t._v(" "),s("p",[t._v("这是一段落"),s("code",[t._v("code")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("const a = 'webpack-demo'\nconsole.log('a', a)\n")])])]),s("hr"),t._v(" "),s("p",[t._v("从这里我们能发现，其实 "),s("code",[t._v("loader")]),t._v(" 接受的参数就是我们 "),s("code",[t._v("md")]),t._v(" 文件的内容，所以我们需要将 "),s("code",[t._v("md")]),t._v(" 文件转换为 "),s("code",[t._v("html")]),t._v("，就需要使用 "),s("code",[t._v("marked")]),t._v(" 方法，继续编写 "),s("code",[t._v("loader")]),t._v(" 文件，引入 "),s("code",[t._v("marked")]),t._v("，处理完成 "),s("code",[t._v("md")]),t._v(" 文件之后，我们再将处理的文件组成文件内容导出。")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("md2html-loader.js")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" marked "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"marked"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nmodule"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("exports")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("source")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" html "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("marked")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("source"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"html"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("module.exports = ")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("JSON")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("stringify")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("我们再去执行，"),s("code",[t._v("npx webpack")]),t._v(" 发现终端打印的输出为一段 "),s("code",[t._v("html")]),t._v(" 字符串，这就是 "),s("code",[t._v("md")]),t._v(" 文件被转换为 "),s("code",[t._v("html")]),t._v("：")]),t._v(" "),s("hr"),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('html <h1 id="今天是-2021-年，开始认真工作的一天">今天是 2021 年，开始认真工作的一天</h1>\n<p>这是一个段落</p>\n<ul>\n<li>这是第一项</li>\n<li>这是第二项</li>\n</ul>\n<p>这是一段落<code>code</code></p>\n<pre><code>const a = &#39;webpack-demo&#39;\nconsole.log(&#39;a&#39;, a)</code></pre>\n')])])]),s("hr"),t._v(" "),s("p",[t._v("然后我们再打开 "),s("code",[t._v("dist")]),t._v(" 目录下的 "),s("code",[t._v("index.html")]),t._v(" 查看页面，"),s("code",[t._v("F12")]),t._v(" 打开控制台发现浏览器控制台打印出了以下内容：")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('md <h1 id="今天是-2021-年，开始认真工作的一天">今天是 2021 年，开始认真工作的一天</h1>\n<p>这是一个段落</p>\n<ul>\n<li>这是第一项</li>\n<li>这是第二项</li>\n</ul>\n<p>这是一段落<code>code</code></p>\n<pre><code>const a = &#39;webpack-demo&#39;\nconsole.log(&#39;a&#39;, a)</code></pre>\n')])])]),s("p",[t._v("浏览器控制台的内容就是我们 "),s("code",[t._v("main.js")]),t._v(" 里打印的内容，至此，说明我们的模块已经生效，"),s("code",[t._v("md")]),t._v(" 转为 "),s("code",[t._v("html")]),t._v(" 也已经生效，并且当我们看到这个字符串的时候其实就已经明白怎么显示到页面上了。")]),t._v(" "),s("p",[t._v("于是我们继续编写 "),s("code",[t._v("main.js")]),t._v("将 html 字符串渲染到页面上：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("main.js")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" md "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./index.md"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// console.log("md", md);')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" ele "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"div"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nele"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" md"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ndocument"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("body"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("appendChild")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ele"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("继续运行，"),s("code",[t._v("npx webpack")]),t._v("，然后我们刷新刚刚的页面，发现生成的 "),s("code",[t._v("html")]),t._v(" 字符串已经被我们渲染到页面上了。")]),t._v(" "),s("p",[t._v("至此一个 "),s("code",[t._v("md")]),t._v(" 转换为 "),s("code",[t._v("html")]),t._v(" 并且显示在页面的简单 "),s("code",[t._v("loader")]),t._v(" 已经完成。")])])}),[],!1,null,null,null);s.default=e.exports}}]);