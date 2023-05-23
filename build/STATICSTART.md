# index.html直接启动
需搭配firefox 禁跨域，file跨域访问
firefox客制化
defaults\autoconfig.js
``` js
pref("general.config.filename", "firefox.cfg");
pref("general.config.obscure_value", 0);

pref("security.fileuri.strict_origin_policy", false);
```

依赖：
```
@vitejs/plugin-legacy
```
vite.config.ts
``` typescript
plugins: [
	...
	legacy({
		targets: ['defaults', 'not IE 11']
	})
	...
]

base: './'
```
测试路由：hash

打包后dist/index.html-body最后添加
``` js
<script>
  (function (win) {
    // 获取页面所有的 <script > 标签对象
    let scripts = document.getElementsByTagName('script')
    // 遍历标签
    for(let i = 0; i < scripts.length; i++) {
      // 提取单个<script > 标签对象
      let script = scripts[i]
      // 获取标签中的 src
      let url = script.getAttribute("src")
      // 获取标签中的 type
      let type = script.getAttribute("type")
      // 获取标签中的js代码
      let scriptText = script.innerHTML
      // 如果有引用地址或者 type 属性 为 "module" 则代表该标签需要更改
      if (url || type === "module") {
        // 创建一个新的标签对象
        let tag=document.createElement('script');
        // 设置src的引入
        tag.setAttribute('url',url);
        // 设置js代码
        tag.innerHTML = scriptText
        // 删除原先的标签
        script.remove()
        // 将标签添加到代码中
        document.getElementsByTagName('head')[0].appendChild(tag)
      }
    }
  })(window)
</script>
```
批处理直接启动 start.bat
``` bat
cd /d "%~dp0Mozilla Firefox
start firefox.exe "%~dp0web\index.html"
```
目录结构
```
|-- Mozilla Firefox
|-- web
|---- ...
|---- index.html
|---- ...
|-- start.bat
```
