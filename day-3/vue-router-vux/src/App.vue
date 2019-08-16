<template>
  <div id="app">
      <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link>
      <router-view></router-view>
      {{this.$store.state}}
  </div>
</template>


<script>
export default {
  mounted(){
    this.$store.dispatch('setUsername');
  }
}
</script>