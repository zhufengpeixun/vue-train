### 1.看别人的包 package.json中看

### 2.看执行的脚背 run build

### 3.找到 scripts/build.js 

- 作用是使用rollup打包源代码

### 4.当前打包的入口文件  src/platform/web

### 5.src

- compiler 编译相关的
- core 核心文件
- platforms 平台
- server 服务端渲染相关
- sfc 解析.vue文件
- shared

### 6.入口文件

entry-runtime-with-compiler 

- Vue.prototype.\$mount 函数劫持

runtime/index

	- Vue.prototype.__patch__ 比对dom
	- Vue.prototype.\$mount 真实的$mount

### 7.core/index vue核心

- initGlobalAPI 初始化全局api
  - Vue.util
  - defineReactive
  - set 
  - delete
  - nextTick
  - initUse
  - extend方法
  - initMixin

### 8.'./instance/index'

真正的vue的构造函数

- initMixin(Vue) // 初始化mixin

  -  initLifecycle(vm) 

    ​    initEvents(vm)

    ​    initRender(vm)

    ​    callHook(vm, 'beforeCreate')

    ​    initInjections(vm) // resolve injections before data/props

    ​    initState(vm)

    ​    initProvide(vm) // resolve provide after data/props

    ​    callHook(vm, 'created')

stateMixin(Vue) // $set $delete $watch

eventsMixin(Vue) // 实现vue的发布订阅模式

lifecycleMixin(Vue) // Vue.prototype._update  $forceUpdate $destroy

renderMixin(Vue) // Vue.prototype._render



mountComponent 挂载组件



### 9.挂载逻辑

core/instance/lifecycle