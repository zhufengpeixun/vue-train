<template>
 <div class="home">
  <ul>
   <li v-for="(item,index) in lists" :key="index">
    <TodoItem :item="item" :index="index" @say="say"></TodoItem>
   </li>
  </ul>
  {{count}} {{this.lists}}
 </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TodoItem from "../components/TodoItem";
import { ITodo } from "../types/todo";
import { State, Mutation, Action } from "vuex-class"; // mapState
@Component({
 components: {
  TodoItem
 }
})
export default class Home extends Vue {
 @State("lists") public l!: [];
 // get count(){ // 计算属性
 //   return this.lists.length
 // }
 @Mutation("hello") public say!: () => void;

 mounted() {
  this.say();
 }
 // say(msg:string):void{
 //   console.log(msg)
 // }
}
</script>
