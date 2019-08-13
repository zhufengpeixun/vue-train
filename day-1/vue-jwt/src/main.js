import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';

// home 显示首页
// login 登录页面
// profile 个人中心页面
const whiteList = ['/'];
router.beforeEach(async (to, from, next) => { // 路由的渲染流程  钩子的执行顺序
  // 要校验一下 当前用户登录没登录
  if (whiteList.includes(to.path)) {
    return next();
  }
  const flag = await store.dispatch('validate');
  if (flag) {
    if (to.path === '/login') {
      next('/');
    } else {
      next(); // 登录过而且不是login  那就ok 跳转吧
    }
  } else {
    // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
    // 看vue文档
    const flag = to.matched.some(item => item.meta.needLogin);
    if (flag) {
      next('/login');
    } else {
      next();
    }
  }
  next();
});

// vuex
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');


// 咱们课程  现在报名有优惠 下次
// 8月17日 周二周四晚上 8-10 周六全天

// 给腾讯课堂个好评
// 感谢大家的坚持
