### 升级注意事项
- raphael 的svg为relative定位的，升级时需要改为absolute

### changelog
- 2013-11-28 bugfix by 治修
- 2013.10.25 升级raphael版本至2.1.2
- 2013.07.15 饼图支持自适应容器
- 2013.12.03 饼图bugfix by 玄道
- 2013.12.18 对kissy1.4的支持
  1. extend的使用方法变了需要做 [兼容性处理](https://gist.github.com/WeweTom/7822062)
  2. 只提供了seed.js，默认是没有DOM，Event模块的，使用需要显示的requires这些模块。
     $.all依赖Node模块，需要显示的requires

- 2014-05-29 修复继承与basechart的数据全零报错的bug by 伯才
- 2014-05-29 修复了父容器display:none导致svg尺寸错误的bug by 伯才
- 2014-07-29 修复了barClick事件不触发的bug by 伯才

- 2015-03-31 去除http协议头 by 伯才
- 2015-04-14 template模块内置
