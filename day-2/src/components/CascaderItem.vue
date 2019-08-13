<template>
 <div class="content">
  <div class="content-left">
   <div v-for="(item,index) in options" :key="index">
    <div class="label" @click="select(item)">{{item.label}}</div>
   </div>
  </div>
  <div class="content-right" v-if="lists && lists.length">
   <CascaderItem :options="lists" :level="level+1" @change="change" :value="value"></CascaderItem>
  </div>
 </div>
</template>
<script>
// Cacader => CascaderItem => CascaderItem =>CascaderItem
import cloneDeep from "lodash/cloneDeep";
export default {
 name: "CascaderItem", // 必须要给当前组件起个名
 computed: {
  lists() { // computed 缓存 value
   // 点击左边 算出右边

    //  如果options变化了 没有更新试图 ，因为没有依赖options
    // 去自己的那一层找自己的儿子
    if(this.value[this.level] && this.value[this.level].id){
        let o = this.options.find(item=>item.id === this.value[this.level].id);
         return  o.children
    }
    // 总共的数据变化了不会触发更新
    // return this.value[this.level] && this.value[this.level].children;
  }
 },
 data() {
  return { currentSeletecd: null };
 },
 methods: {
  change(item) {
   this.$emit("change", item);
  },
  select(item) {
   // 每次选择的时候 需要跟父亲说 我改了 父亲去更新
   // 需要把数据拷贝一分 把数据改好提交给父亲
   this.currentSeletecd = item; // 把当前左边选中的这一项存储起来
   let cloneValue = cloneDeep(this.value); // 把父组件传递的属性拷贝
   cloneValue[this.level] = item;
   cloneValue.splice(this.level + 1); // 当前点击某一项 就将自己的后面+1的所有项都删除掉
   this.$emit("change", cloneValue);
  }
 },
 props: {
  level: {
   type: Number
  },
  value: {
   type: Array,
   default: () => []
  },
  options: {
   type: Array,
   default: () => []
  }
 }
};
</script>