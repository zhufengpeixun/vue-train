# Vue性能优化

## 一.编码优化
### 1).data属性  
不要将所有的数据都放在data中，data中的数据都会增加getter和setter，会收集对应的watcher
```javascript
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() // 收集依赖
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify() // 执行watcher的update
    }
  })
}
```

### 2).SPA页面采用keep-alive缓存组件
keep-alive可以实现组件的缓存功能，缓存当前组件的实例
```javascript
render () {
    const slot = this.$slots.default // 获取默认插槽
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if ( // 匹配 include / exclude
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) { // 如果有缓存 直接将缓存返回
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode // 缓存下来下次用
        keys.push(key)
        // 超过缓存限制 就删除
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
```
  
### 3).拆分组件 
  - 提高复用性、增加代码的可维护性
  - 减少不必要的渲染 (尽可能细化拆分组件)

### 4).v-if 
当值为false时内部指令不会执行,具有阻断功能，很多情况下使用v-if替代v-show

### 5).key保证唯一性 
- 默认vue会采用就地复用策略
- 如果数据项的顺序被改变，Vue不会移动DOM元素来匹配数据项的顺序
- 应该用数据的id作为key属性

### 6).Object.freeze
vue会实现数据劫持，给没个属性增加getter和setter，可以使用freeze冻结数据
```javascript
Object.freeze([{ value: 1 },{ value: 2 }]);
```
在数据劫持时属性不能被配置，不会重新定义
```javascript
const property = Object.getOwnPropertyDescriptor(obj, key)
if (property && property.configurable === false) {
return
}
```

### 7).路由懒加载、异步组件
动态加载组件，依赖webpack-codespliting功能
```javascript
const router = new VueRouter({
  routes: [
    { path: '/foo', component: () => import(/* webpackChunkName: "group-foo" */ './Foo.vue') }
    { path: '/bar', component: () => import(/* webpackChunkName: "group-foo" */ './Bar.vue') }
  ]
})
```
动态导入组件
```javascript
import Dialog from "./Dialog";
export default {
  components: {
    Dialog: () => import("./Dialog")
  }
};
```
### 8).runtime运行时
在开发时尽量采用单文件的方式.vue 在webpack打包时会进行模板的转化

### 9).数据持久化的问题 
- vuex-persist 合理使用 (防抖、节流)

## 二.vue加载性能优化
- 第三方模块按需导入 (babel-plugin-component)
- 图片懒加载  滚动到可视区域动态加载
- 滚动渲染可视区域 数据较大时只渲染可视区域 (计算scrollTop)

## 三.用户体验
### 1).app-skeleton
配置webpack插件 vue-skeleton-webpack-plugin  
单页骨架屏幕
```javascript
import Vue from 'vue';
import Skeleton from './Skeleton.vue';
export default new Vue({
    components: {
        Skeleton:Skeleton
    },
    template: `
        <Skeleton></Skeleton>    
    `
});
// 骨架屏
plugins: [
    new SkeletonWebpackPlugin({
        webpackConfig: {
            entry: {
                app: resolve('./src/entry-skeleton.js')
            }
        }
    })
]
```

带路由的骨架屏，编写skeleton.js文件
```javascript
import Vue from 'vue';
import Skeleton1 from './Skeleton1';
import Skeleton2 from './Skeleton2';

export default new Vue({
    components: {
        Skeleton1,
        Skeleton2
    },
    template: `
        <div>
            <skeleton1 id="skeleton1" style="display:none"/>
            <skeleton2 id="skeleton2" style="display:none"/>
        </div>
    `
});
```

```javascript
new SkeletonWebpackPlugin({
    webpackConfig: {
        entry: {
            app: path.join(__dirname, './src/skeleton.js'),
        },
    },
    router: {
        mode: 'history',
        routes: [
            {
                path: '/',
                skeletonId: 'skeleton1'
            },
            {
                path: '/about',
                skeletonId: 'skeleton2'
            },
        ]
    },
    minimize: true,
    quiet: true,
})
```

> 优化白屏效果

实现骨架屏插件
```javascript
class MyPlugin {
    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data) => {
                    data.html = data.html.replace(`<div id="app"></div>`, `
                        <div id="app">
                            <div id="home" style="display:none">首页 骨架屏</div>
                            <div id="about" style="display:none">about页面骨架屏</div>
                        </div>
                        <script>
                            if(window.hash == '#/about' ||  location.pathname=='/about'){
                                document.getElementById('about').style.display="block"
                            }else{
                                document.getElementById('home').style.display="block"
                            }
                        </script>
                    `);
                    return data;
                }
            )
        });
    }
}
```

### 2).app-shell
### 3).pwa manifest serviceWorker

> 浏览器性能分析=>performance


## 四.SEO优化方案
### 1).vue的预渲染插件
```bash
npm install prerender-spa-plugin 
```

缺陷数据不够动态，可以使用ssr服务端渲染
```javascript
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');
module.exports = {
    configureWebpack: {
        plugins: [
            new PrerenderSPAPlugin({
                staticDir: path.join(__dirname, 'dist'),
                routes: [ '/', '/about',],
            })
        ]
    }
  }
```
### 2).什么是服务端渲染?
概念：放在浏览器进行就是浏览器渲染,放在服务器进行就是服务器渲染。
- 客户端渲染不利于 SEO 搜索引擎优化
- 服务端渲染是可以被爬虫抓取到的，客户端异步渲染是很难被爬虫抓取到的
- SSR直接将HTML字符串传递给浏览器。大大加快了首屏加载时间。
- SSR占用更多的CPU和内存资源
- 一些常用的浏览器API可能无法正常使用
- 在vue中只支持beforeCreate和created两个生命周期

![](https://www.fullstackjavascript.cn/ssr.png)

> 服务端渲染 SSR => NuxtJS



### 五.webpack打包优化
- 使用cdn的方式加载第三方模块,设置externals 
```javascript
externals: {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
}
<script src="https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js"></script>
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
<script src="https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js"></script>
```
- 多线程打包 happypack
- splitChunks 抽离公共文件
- sourceMap的配置 

> webpack-bundle-analyzer 分析打包的插件

## 五.缓存，压缩
### 1).服务端缓存，客户端缓存
### 2) 服务端gzip压缩
