(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{294:function(e,v,_){"use strict";_.r(v);var t=_(10),r=Object(t.a)({},(function(){var e=this,v=e._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h2",{attrs:{id:"父组件"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#父组件"}},[e._v("#")]),e._v(" 父组件")]),e._v(" "),v("p",[e._v("在 "),v("code",[e._v("react")]),e._v(" 中使用函数组件以及 "),v("code",[e._v("hooks")]),e._v(" 之后，有遇到，在父组件需要调用子组件方法的地方，可以通过 "),v("code",[e._v("ref")]),e._v(" 的转发，做到在父组件执行子组件的方法，为什么需要转发 "),v("code",[e._v("refs")]),e._v("，是因为默认情况下，函数组件没有实例，无法使用 "),v("code",[e._v("ref")]),e._v(" 属性。所以如果需要在函数组件中使用 "),v("code",[e._v("ref")]),e._v("，其是指向 "),v("code",[e._v("dom")]),e._v(" 元素。")]),e._v(" "),v("p",[e._v("其具体流程是：在父组件中创建 "),v("code",[e._v("ref")]),e._v("，并且通过属性的方式传递给子组件，子组件通过 "),v("code",[e._v("forwardRef")]),e._v(" 包裹子组件，这样才能在子组件中的第二个参数中获取到 "),v("code",[e._v("ref")]),e._v("，此时获取到 "),v("code",[e._v("ref")]),e._v(" 之后，"),v("code",[e._v("ref")]),e._v(" 已经转发成功，当 "),v("code",[e._v("ref")]),e._v(" 挂载完成之后，"),v("code",[e._v("ref.current")]),e._v(" 将会指向子组件。")]),e._v(" "),v("ul",[v("li",[v("code",[e._v("parent.tsx")]),e._v("，引入"),v("code",[e._v("useRef")])])]),e._v(" "),v("img",{attrs:{src:e.$withBase("/assets/images/react/parent.png"),width:"500px"}}),e._v(" "),v("h2",{attrs:{id:"子组件"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#子组件"}},[e._v("#")]),e._v(" 子组件")]),e._v(" "),v("ul",[v("li",[v("code",[e._v("child.tsx")]),e._v("，引入"),v("code",[e._v("forwardRef")]),e._v("和"),v("code",[e._v("useImperativeHandle")]),e._v(" "),v("img",{attrs:{src:e.$withBase("/assets/images/react/children.jpg")}})])])])}),[],!1,null,null,null);v.default=r.exports}}]);