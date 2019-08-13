# JWT认证

## 使用vue-cli3.0创建vue项目
```bash
vue create <project-name>
```
可以通过vue ui创建项目／管理项目依赖
vue ui



## 配置vue-config.js
```javascript
let path = require('path')
module.exports = {
    publicPath:process.env.NODE_ENV === 'production'? '/vue-project':'/',
    outputDir:'myassets', // 输出路径
    assetsDir:'static', // 生成静态目录的文件夹
    runtimeCompiler: true, // 是否可以使用template模板
    parallel:require('os').cpus().length > 1, //多余1核cpu时 启动并行压缩
    productionSourceMap:false, //生产环境下 不使用soruceMap

    // https://github.com/neutrinojs/webpack-chain
    chainWebpack:config=>{
        // 控制webpack内部配置
        config.resolve.alias.set('component',path.resolve(__dirname,'src/components'));
    },
    // https://github.com/survivejs/webpack-merge
    configureWebpack:{
        // 新增插件等
        plugins:[]
    },
    devServer:{ // 配置代理
        proxy:{
            '/api':{
                target:'http://a.zf.cn:3000',
                changeOrigin:true
            }
        }
    },
    // 第三方插件配置
    pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [
                // 插入全局样式
                path.resolve(__dirname,'src/assets/common.less'), 
			],
		}
	}
}
```

## 一.什么是jwt？

- JSON Web Token（JWT）是目前最流行的跨域身份验证解决方案

  **解决问题**：session不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。

  **优点**：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

### JWT包含了使用`.`分隔的三部分

- Header 头部 

  ```javascript
  { "alg": "HS256", "typ": "JWT"}   
  // algorithm => HMAC SHA256
  // type => JWT
  ```

- Payload 负载、载荷

  ```
  JWT 规定了7个官方字段
  iss (issuer)：签发人
  exp (expiration time)：过期时间
  sub (subject)：主题
  aud (audience)：受众
  nbf (Not Before)：生效时间
  iat (Issued At)：签发时间
  jti (JWT ID)：编号
  ```

- Signature 签名

  对前两部分的签名，防止数据篡改

  ```javascript
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret)
  ```

JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。这就是 Base64URL 算法。

### 使用方式

HTTP 请求的头信息`Authorization`字段里面

```
Authorization: Bearer <token>
```

通过url传输

```
http://www.xxx.com/pwa?token=xxxxx
```

如果是post请求也可以放在请求体中


## 二.服务端返回TOKEN
```javascript
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method.toLowerCase() === 'options'){
        return res.end();
    }
    next();
})
app.use(bodyParser.json());
let secret = 'zfjg';
app.get('/test',(req,res)=>{
    res.end({test:'test'})
})
app.post('/login',(req,res)=>{
   let {username} = req.body;
   if(username === 'admin'){ // 如果访问的是admin 种植cookie
        res.json({
            code:0,
            username:'admin',
            token:jwt.sign({username:'admin'},secret,{
                expiresIn:20  
            })
        })
   }else{
       res.json({
           code:1,
           data:'用户名不存在'
       })
   }
});
app.get('/validate',(req,res)=>{
    let token = req.headers.authorization;
    jwt.verify(token,secret,(err,decode)=>{ // 验证token的可靠性
        if(err){
            return res.json({
                code:1,
                data:'token失效了'
            })
        }else{
            res.json({ 
                username:decode.username,
                code:0, // 延长tokne的过期时间
                token:jwt.sign({username:'admin'},secret,{
                    expiresIn:20  
                })
            })
        }
    });
});

app.listen(3000);
```



## 三.路由配置
- Home.vue     首页
- Profile.vue  个人中心
- Login.vue    登录页面

```javascript
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { needLogin: true }, // 必须要登录才能访问
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
```


## 四.axios封装
```javascript
import axios from 'axios';


class FetchData {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'; // 请求路径 
    this.timeout = 3000; // 设置超时时间
  }

  setInterceptor(instance) { // 设置拦截器
    instance.interceptors.request.use(config => {
      config.headers.Authorization = `${localStorage.getItem('token')}`;
      return config; // 增加token
    }, (err) => {
      Promise.reject(err);
    });

    instance.interceptors.response.use(res => res.data, (err) => {
      Promise.reject(err);
    });
  }

  request(request) {
    const instance = axios.create();
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...request,
    }; // 合并配置
    this.setInterceptor(instance);
    return instance(config);
  }
}

export default new FetchData();
```

## 五.测试接口
```javascript
export const getTest = () => fetchData.request({ url: '/test' });
export const login = username => fetchData.request({
  url: '/login',
  method: 'POST',
  data: {
    username,
  },
});
export const validate = () => fetchData.request({ url: '/validate' });
```

## 六.在vuex中发送请求
```javascript
export default new Vuex.Store({
  state: {
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
  },
  actions: {
    async login({ commit }, username) {
      const r = await login(username); // 登录成功后返回用户名信息
      if (r.token) { // 如果有返回token说明成功
        commit('setUsername', username); // 将用户存入state中
        localStorage.setItem('token', r.token); // 将token存放起来
      } else { // 否则返回失败的promise
        return Promise.reject(r);
      }
    },
  },
});
```

## 七.权限认证
```javascript
async validate({ commit }) {
    const r = await validate();
    if (r.code === 1) {
        return false;
    }
    commit('setUsername', r.username);
    localStorage.setItem('token', r.token); // 将token存放起来
    return true;
}
```

判断用户访问权限
```javascript
router.beforeEach(async (to, from, next) => {
  // 如果不需要校验可以设置白名单
  const isLogin = await store.dispatch('validate');
  if (isLogin) {
    // 如果是登录
    if (to.name === 'login') {
      next('/profile');
    } else {
      next();
    }
  } else {
    const flag = to.matched.some(item => item.meta.needLogin);
    if (flag) {
      next('/login');
    } else {
      next();
    }
  }
});

```


![](https://www.fullstackjavascript.cn/wx.png)