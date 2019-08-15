import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

router.beforeEach(async (to,from,next)=>{
  if(!store.state.hasPermission){ // 如果没权限 需要获取权限
    // 获取需要添加的路由
    let newRoutes = await store.dispatch('getNewRoute');
    // 动态添加路由
    router.addRoutes(newRoutes); // 动态添加我需要的路由
    next({...to}); // replaceState
  }else{
    next();
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
