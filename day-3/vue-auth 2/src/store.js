import Vue from "vue";
import Vuex from "vuex";
import {authRoutes} from './router';
Vue.use(Vuex);
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.interceptors.response.use(res => {
  return res.data;
});
// 权限相关的
const getTreeList = menuList => {
  let menu = []; // 用来渲染菜单的
  let routeMap = {};
  let auths = [];
  menuList.forEach(m => {
    auths.push(m.auth);
    m.children = []; // 增加一个孩子列表
    routeMap[m.id] =m ;
    if(m.pid == -1){ // 是根节点
      menu.push(m);
    }else{
      if(routeMap[m.pid]){ //找到对应的父亲 将值 塞进去
        routeMap[m.pid].children.push(m);
      }
    }
  });
  return {menu,auths}
};
const formatList = (authRoutes,auths)=>{
  return authRoutes.filter(route=>{
    if(auths.includes(route.name)){
      if(route.children){
        route.children = formatList(route.children,auths)
      }
      return true
    }
  })
}
export default new Vuex.Store({
  state: {
    hasPermission: false,
    menuList:[],
    btnPermission:{
      'edit':true,
      'add':false
    }
  },
  mutations: {
    setMenuList(state,menu){
      state.menuList = menu
    },
    setPermission(state){
      state.hasPermission = true;
    }
  },
  actions: {
    async getNewRoute({commit,dispatch}) {
      // 发起请求 请求后端数据
      // 需要 把刚才的扁平的数据
      // 获取权限
      let { menuList } = await axios.get("/roleAuth");
      let {auths,menu} = getTreeList(menuList);
      commit('setMenuList',menu);
     
      let needRoutes = formatList(authRoutes,auths);
      commit('setPermission')
      return needRoutes;
    }
  }
});
