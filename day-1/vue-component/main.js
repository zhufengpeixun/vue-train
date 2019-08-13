import Vue from 'vue';
import App from './App';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView)
Vue.prototype.$bus = new Vue(); // $on $emit
// 向上通知
Vue.prototype.$dispatch = function(eventName,value){
    let parent = this.$parent;
    while(parent){
        parent.$emit(eventName,value);
        parent = parent.$parent
    }
}
// 向下传递
Vue.prototype.$broadcast = function(eventName,value){
     // 获取当前组件下的所有的孩子
     const broadcast = (children) =>{
        children.forEach(child => {
            child.$emit(eventName,value);
            if(child.$children){
                broadcast(child.$children);
            }
         });
     }
     broadcast(this.$children);
   
}
const vm = new Vue({
    el:'#app',
    render:h=> h(App)
})
// 组件间通信
// 构建 通信组件