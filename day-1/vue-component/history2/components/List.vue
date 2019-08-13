<template>
 <div>
  <template v-for="(item,index) in data">
   <li :key="index" v-if="!render">{{item}}</li>
   <ListItem v-else :key="`a${index}`" :render="render" :item="item"></ListItem>
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