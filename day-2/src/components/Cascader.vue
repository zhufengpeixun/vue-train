<template>
    <div class="cascader" v-click-outside="close">
        <div class="title" @click="toggle">
            {{result}}
        </div>
        <div  v-if="isVisible">
            <CascaderItem :options="options" :value="value" :level="0" @change="change"></CascaderItem>
            <!-- 先显示第一层内容 -->
        </div>
    </div>
</template>
<script>
// 可以在全局上挂个事件 ，当点击的时候校验一下点击的是否是cascader中的内容
// 判断当前点击的是否在某个元素

// 如果你希望对某个元素拥有一系列的操作 你可以封装一个指令 （自定义指令）
// click-outside

// export default 导出的是值
// export xxx 导出的是接口


// icon button input form 穿梭框  表格 树 日期组件
import util from '../directives/clickOutside';
import CascaderItem from './CascaderItem';
import cloneDeep  from 'lodash/cloneDeep'
export default {
    components:{
        CascaderItem
    },
    props:{
        lazyload:{
            type:Function
        },
        value:{
            type:Array,
            default:()=>[]
        },
        options:{
            type:Array,
            default:()=>[]
        }
    },
    directives:{
        clickOutside:util.clickOutside,
    },
    computed:{
        result(){
            return this.value.map(item=>item.label).join('/')
        }
    },
    methods:{
        handle(id,children){
            let cloneOptions = cloneDeep(this.options);
            // 遍历 树可以采用深度 或者广度
            // 去树中如何找到当前id 为这一项的那个人
            let stack = [...cloneOptions];
            let index = 0;
            let current;
            while(current = stack[index++]){ // 广度遍历
                if(current.id!==id){
                    if(current.children){
                        stack = stack.concat(current.children);
                    }
                }else{
                    break;
                }
            }
            if(current){ // 动态的数据加载好后 传递给父亲 
                current.children = children; // 动态的添加儿子节点
                this.$emit('update:options',cloneOptions)
            }
        },
        change(value){
            // 现获取点击的是谁 在调用用户的lazyload方法
            let lastItem = value[value.length-1];
            let id = lastItem.id;
            if(this.lazyload){
                // 我需要给 当前id 的这一项 添加一个children属性
                this.lazyload(id,(children)=>this.handle(id,children));
            }
            this.$emit('input',value);
        },
        close(){ // 关闭弹框
            this.isVisible = false;
        },
        toggle(){ // 切换显示隐藏
            this.isVisible = !this.isVisible;
        }
    },
    data(){
        return {isVisible:false}
    }
}
</script>
<style lang="stylus">
.cascader
    display inline-block;
.title 
    width 150px;
    height 30px;
    border 1px solid #ccc;
.content
    display flex
.content-left
    border:1px solid #ccc;
    min-height:150px;
    max-height:150px;
    overflow-y scroll;
.label
    width 80px;
    padding-left 5px;
.label:hover
    background:#999;
    cursor pointer
.title
    line-height 30px;
</style>


