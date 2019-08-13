<template>
    <div>
        儿子二 {{$attrs}} 
        <!-- $attrs 表示属性的集合 -->
        <!-- $listeners 表示的是方法的集合 -->
        <!-- v-bind 属性 -->
        <!--  v-on 方法-->
        <Grandson2 v-bind="$attrs" v-on="$listeners"></Grandson2>
    </div>
</template>

<script>

import Grandson2 from './Grandson2'
export default {
    components:{
        Grandson2
    },
    inheritAttrs:false,
    mounted(){
        this.$bus.$on('有人找我了',function(){
            console.log('呵呵~~~~')
        });
    }
}
</script>