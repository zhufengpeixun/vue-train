import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// 代码规范校验 用的 yorkie => husky (.git hook)lint-staged
new Vue({
  render: h => h(App),
}).$mount('#app');
