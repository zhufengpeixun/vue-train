<template>
 <el-menu default-active="2" class="el-menu-vertical-demo">
  <template v-for="(item,index) in $store.state.menuList">
      <MenuItem :item="item" :key="index"></MenuItem>
  </template>
 </el-menu>
</template>
<script>
import MenuItem from './MenuItem';
export default {
    components:{
        MenuItem
    }
};
</script>