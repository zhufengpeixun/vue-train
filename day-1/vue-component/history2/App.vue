<template>
    <div>
       App
       <Level :t="1">标题</Level>
       <Level :t="2">标题</Level>
       <Level :t="3">标题</Level>
       <Level :t="4">标题</Level>
       <Level :t="5">标题</Level>

        <!-- 提供render  element-ui tree -->
        <List :data="['香蕉','苹果','橘子']" :render="render"></List>

        <!-- element-ui scope-slot 作用域插槽 -->

        <!-- 组件封装 -->
        <List1 :data="['香蕉','苹果','橘子']">
            <!-- 回调函数 -->
            <!-- 普通插槽是在父组件中执行 -->
            <!-- 子组件中执行的是 作用域插槽 -->
            <template v-slot:a="{item,a}">
               <span>{{item}} {{a}}</span>
            </template>
        </List1>
    </div>
  
</template>

<script>
// 实现一个小组件 标题组件 Level type="6"
// 函数式组件 没有模板 必须要有一个render函数
import List from './components/List';
import Level from './components/LevelFunctional.js';
import List1 from './components/List1'
export default {
    methods:{  
        render(h,data){ // data是函数式组件在list组件中每次循环出来的结果
            return <h1>{data}</h1>
        }
    },
    components:{
        Level,
        List,
        List1
    }
}
</script>