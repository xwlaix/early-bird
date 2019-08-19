---
title: 早鸟金流后台管理前端框架
date: 2019-06-05 10:53:56
tags: 
- 公司
categories: 
- 项目
---
# ebcf-backend-admin
> 这是一个由管理后台[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)相关功能组件组成的。
## 说明
+ 接口请求`request.js`采用axios统一拦截处理，封装单个接口地址，设置遮盖loading层。
+ 路由设置`router`，绑定对应地址，配置相关参数。
+ 组件有分页`Pagination`，图标`SvgIcon`，表格`Table`，富文本`Tinymce`，上传`Upload`等。
+ 指令有权限按钮级别的`permission`，按钮水波纹`wave`。
+ 本地数据储层用的是`vuex`，分模块管理。
+ 权限菜单和用户角色来动态生成侧边栏和路由，是采用[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)中相关的功能
+ 本项目基于`wepack4`开发。
+ pdf预览打包在项目内。
+ word的预览采用微软的iframe。
## 目录结构
 ```
├── build                      // 构建相关  
├── mock                       # 项目mock 模拟数据
├── plop-templates             # 基本模板
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体 国家地址，国家日历编码等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filters                # 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── layout                 # 全局 layout
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── permission.js          // 权限管理
├── tests                      # 测试
├── static                     // 第三方不打包资源
│   ├── pdf                    // PDF预览
│   └── Tinymce                // 富文本
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
 ```

### api 和 views
根据业务模块来划分 views，并且 将views 和 api 两个模块一一对应，从而方便维护。
{% asset_img apiView.png apiview文件 %} 

### components
这里的components主要放置的都是全局公用的一些组件，如上传组件，富文本，表格，分页等等
{% asset_img components.png components文件 %} 

## ESLint
代码规范采用eslint，推荐使用vscode+eslint来写。
+ 首先安装eslint插件
+ 再去vscode进行扩展设置，一次点击文件》首选项》设置，打开vscode配置文件，添加如下配置
```
 "files.autoSave":"off",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    { "language": "vue", "autoFix": true }
  ],
  "eslint.options": {
    "plugins": ["html"]
  }
```
## 封装 axios
具体请看代码注释，路径为`src/utils/request.js`，请求时区分运行环境地址是在`config`中设置。
统一拦截请求，添加请求头`authKey,sessionId`和请求时的loading层，对返回数组数据进行table默认值设置。

## 前后端交互
### 跨域问题
dev环境通过 webpack-dev-server的proxy来解决，开发环境用nginx反代理一下就好了。
### 前后端的交互问题
在禅道理解需求，在原型图上编写页面视图，整理后台需要提交的接口参数，然后再写出相应的逻辑，模拟页面操作，之后再对接接口，先行自己测试之后没问题，再交给测试人员测试。

## 权限路由
+ 登录：当用户填写完账号和密码后向服务端验证是否正确，验证通过之后，服务端会返回一个token，拿到token之后（我会将这个token存贮到cookie中，保证刷新页面后能记住用户登录状态），前端会根据token再去拉取一个 菜单权限 的接口来获取用户的详细信息（如用户权限，用户名等等信息）。
+ 权限验证：通过token获取用户对应的 role，动态根据用户的 role 算出其对应有权限的路由，通过 router.addRoutes 动态挂载这些路由。
+ 上述所有的数据和操作都是通过vuex全局管理控制的。(补充说明：刷新页面后 vuex的内容也会丢失，所以需要重复上述的那些操作)。

## 需要注意的一些坑
### Table
> 由于JavaScript的限制，Vue不能检测一下变动的数组：*当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
所以当我们想改变tbale中的第一条数据的值，通过`this.list[0]=newValue`这样是不会生效的。

```
//解决方案：
// Array.prototype.splice
example.items.splice(indexOfItem,1,newValue)
```
所以我们可以通过
```
//添加数据
this.list.unshift(this.temp)
this.list.push(this.temp)

//删除数据
const index  = this.list.indexOf(row) //找到要修改的数据在list中的位置
this.list.splice(index,1) //通过splice删除数据

//修改数据
const index  = this.list.indexOf(row) //找到要修改的数据在list中的位置
this.list.splice(index,1,this.updatedDate) //通过splice替换数据触发视图更新
```
### dialog
修改行的数据不能直接赋值给dialog，直接赋值的话引用类型共享一个内存区域。所以我们需要重新指向一个新的引用
```
//赋值对象是一个obj
this.objData = Object.assign({},row) //这样就不会公用同一个对象
//数据 
newArray = oldArray.splice() //slice会clone返回一个新数组
```
### 富文本
使用 由于富文本不适合双向数据流，所以只会 watch 传入富文本的内容一次变化，只会就不会再监听了，如果之后还有改变富文本内容的需求。 可以通过 this.refs.xxx.setContent() 来设置
## 相关项目
+ [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

## 编译运行
```bash
# Clone project
git clone git@gitlab.com:ebcf-backend/admin.git

# Install dependencies
npm install

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build:prod

```