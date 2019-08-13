<template>
 <div>
  <template v-for="(item,index) in data">
       <slot name="a" :item="item" :a="1"></slot> 
  </template>
 </div>
</template>

<script>
import ListItem from "./ListItem";
export default {
 components: {
  ListItem
 },
 props: {
  render: {
   type: Function
  },
  data: {
   type: Array,
   default: () => []
  }
 }
};
</script>