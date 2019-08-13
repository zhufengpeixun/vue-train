<template>
 <div>
  <!-- 获取用户选择的数据 -->
  <Cascader :options.sync="options" v-model="value" :lazyload="lazyload"></Cascader>
 </div>
</template>
<script>
import cityList from "./data.json";
import Cascader from "./components/Cascader.vue";
const fetchData = pid => {
 return new Promise((resolve, reject) => {
  setTimeout(() => {
   resolve(cityList.filter(item => item.pid == pid));
  }, 100);
 });
};
export default {
 components: {
  Cascader
 },
 async created() {
  this.options = await fetchData(0);
 },
 data() {
  return {
   value: [],
   options: []
  };
 },
 methods:{
     // 需要在组件内部来处理
    //  async input(value){ //[{},{}]
    //     let currentItem =  value[value.length-1];
    //     let children = await fetchData(currentItem.id);
    //     this.$set(currentItem,'children',children); // Object.defineProperty
    //  },
     async lazyload(id,callback){ // 你需要传入一个方法 这个方法第一个参数是你选中的id
        let children = await fetchData(id);
        callback(children);
     }
 }
};
</script>