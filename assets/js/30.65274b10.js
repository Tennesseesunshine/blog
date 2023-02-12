(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{305:function(v,_,t){"use strict";t.r(_);var a=t(10),d=Object(a.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"ipv4"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ipv4"}},[v._v("#")]),v._v(" IPv4")]),v._v(" "),_("p",[v._v("最近重新学习了下关于网络的子网划分和子网掩码的计算规则，简单总结下几个知识点 IP 地址、子网掩码、网络号、主机号、网络地址、主机地址")]),v._v(" "),_("h2",{attrs:{id:"基础知识"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#基础知识"}},[v._v("#")]),v._v(" 基础知识")]),v._v(" "),_("p",[v._v("我们都知道 IPv4 是一组 192.21.212.155 以点分割的四组十进制，转换为 二进制就是 4 个字节，每一个字节 8 位也就是 "),_("code",[v._v("32 位 二进制")]),v._v("。而每一个字节都是可以是 0-255 也就是 2^0~2^7，加起来就是 255 个。")]),v._v(" "),_("p",[v._v("简单说明：")]),v._v(" "),_("p",[v._v("假设我们现在利用二进制来表示")]),v._v(" "),_("p",[v._v("00000000 对应的位分别是 2^7|2^6|2^5|2^4|2^3|2^2|2^1|2^0 也就是说，8 个 0 每一个位上对应的十进制都如下表。")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")]),v._v(" "),_("th",[v._v("0")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("128")]),v._v(" "),_("td",[v._v("64")]),v._v(" "),_("td",[v._v("32")]),v._v(" "),_("td",[v._v("16")]),v._v(" "),_("td",[v._v("8")]),v._v(" "),_("td",[v._v("4")]),v._v(" "),_("td",[v._v("2")]),v._v(" "),_("td",[v._v("1")])])])]),v._v(" "),_("p",[v._v("通过这个规则，我们将 192.168.212.155 二进制表示的话就是 11000000.10101000.11010100.10011011")]),v._v(" "),_("h2",{attrs:{id:"网络划分"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#网络划分"}},[v._v("#")]),v._v(" 网络划分")]),v._v(" "),_("p",[v._v("一般我们的 IP 地址划分的时候都有"),_("code",[v._v("主机号")]),v._v("和"),_("code",[v._v("网络号")]),v._v("，但是主机号和网络号是需要通过子网掩码计算得到的。所以先知道这个概念，后面我们可以通过计算得到。")]),v._v(" "),_("h3",{attrs:{id:"ip-地址分类"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ip-地址分类"}},[v._v("#")]),v._v(" IP 地址分类")]),v._v(" "),_("p",[v._v("IP 地址 划分的时候会有 ABCDE，他们有一个划分规则。")]),v._v(" "),_("img",{attrs:{src:v.$withBase("/assets/images/network/IP_type.png")}}),v._v(" "),_("p",[v._v("A：这样 A 类地址的第一位 IP 就是 0 ～ 127。")]),v._v(" "),_("p",[v._v("B：这样 B 类的地址的第一位 IP 范围就是 128 ～ 191。")]),v._v(" "),_("p",[v._v("C：范围 192-223。")]),v._v(" "),_("p",[v._v("所以当我们拿到一个 IP 地址之后，我们基本上就判断出来这个 IP 是属于哪类 IP。")]),v._v(" "),_("h3",{attrs:{id:"网络号和主机号"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#网络号和主机号"}},[v._v("#")]),v._v(" 网络号和主机号")]),v._v(" "),_("p",[v._v("A 类 IP 地址的网络号是其第一组也就是第一整个字节，也就是说前 8 位是网络号，一共 256（0-255） 个网络号，剩下的三个字节为主机号，而每一个字节容纳的主机是 256（0-255）个，所以 A 类网络一共是 256 个网络，每一个网络容纳的主机数为 "),_("code",[v._v("256*256*256")]),v._v("。从这个容纳的主机数上看，数量有点大，可以容纳的主机号一共是"),_("code",[v._v("256*256*256")]),v._v("个，但是有可能并没这么多的设备，所以就产生了剩下的两种网络号。")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("主机号")]),v._v(" "),_("th",[v._v("主机号")]),v._v(" "),_("th",[v._v("主机号")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("255")]),v._v(" "),_("td",[v._v("0")]),v._v(" "),_("td",[v._v("0")]),v._v(" "),_("td",[v._v("0")])])])]),v._v(" "),_("p",[v._v("B 类的网络号是前两个字节也就是前 16 位，后面两个字节是主机号，这样 B 类一共是 "),_("code",[v._v("256*256")]),v._v(" 个网络，每一个网络有 256 个地址。")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("主机号")]),v._v(" "),_("th",[v._v("主机号")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("255")]),v._v(" "),_("td",[v._v("255")]),v._v(" "),_("td",[v._v("0")]),v._v(" "),_("td",[v._v("0")])])])]),v._v(" "),_("p",[v._v("C 类是将前三个字节，前 24 位作为网络号 255.255.255，剩下后一位为主机号，一共 256 个地址。")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("网络号")]),v._v(" "),_("th",[v._v("主机号")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("255")]),v._v(" "),_("td",[v._v("255")]),v._v(" "),_("td",[v._v("255")]),v._v(" "),_("td",[v._v("0")])])])]),v._v(" "),_("ul",[_("li",[v._v("私有 IP 网段")])]),v._v(" "),_("p",[v._v("· 10.0.0.0 ～ 10.255.255.255；")]),v._v(" "),_("p",[v._v("· 172.16.0.0 ～ 172.31.255.255；")]),v._v(" "),_("p",[v._v("· 192.168.0.0 ～ 192.168.255.255。")])])}),[],!1,null,null,null);_.default=d.exports}}]);