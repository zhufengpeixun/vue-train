# render函数之JSX应用

## 一.模板缺陷
模板的最大特点是扩展难度大，不易扩展。可能会造成逻辑冗余
```html
<Level :type="1">哈哈</Level>
<Level :type="2">哈哈</Level>
<Level :type="3">哈哈</Level>
```
Level组件需要对不同的type产生不同的标签
```html
<template>
 <h1 v-if="type==1">
  <slot></slot>
 </h1>
 <h2 v-else-if="type==2">
  <slot></slot>
 </h2>
 <h3 v-else-if="type==3">
  <slot></slot>
 </h3>
</template>
<script>
export default {
 props: {
  type: {
   type: Number
  }
 }
};
</script>
```

## 二.函数式组件
函数式组件没有模板,只允许提供render函数
```javascript
export default {
 render(h) {
  return h("h" + this.type, {}, this.$slots.default);
 },
 props: {
  type: {
   type: Number
  }
 }
};
```

> 复杂的逻辑变得非常简单

## 三.JSX应用
使用jsx会让代码看起来更加简洁易于读取
```javascript
export default {
 render(h) {
  const tag = "h" + this.type;
  return <tag>{this.$slots.default}</tag>;
 },
 props: {
  type: {
   type: Number
  }
 }
};
```


## 四.render方法订制组件
编写List组件可以根据用户传入的数据自动循环列表
```html
<List :data="data"></List>
<script>
import List from "./components/List";
export default {
 data() {
  return { data: ["苹果", "香蕉", "橘子"] };
 },
 components: {
  List
 }
};
</script>

<!-- List组件渲染列表 -->
<template>
 <div class="list">
  <div v-for="(item,index) in data" :key="index">
   <li>{{item}}</li>
  </div>
 </div>
</template>
<script>
export default {
 props: {
  data: Array,
  default: () => []
 }
};
</script>
```

通过render方法来订制组件,在父组件中传入render方法

```html
<List :data="data" :render="render"></List>
render(h, name) {
   return <span>{name}</span>;
 }
```

我们需要createElement方法，就会想到可以编写个函数组件，将createElement方法传递出来

```html
<template>
 <div class="list">
  <div v-for="(item,index) in data" :key="index">
   <li v-if="!render">{{item}}</li>
   <!-- 将render方法传到函数组件中，将渲染项传入到组件中，在内部回调这个render方法 -->
   <ListItem v-else :item="item" :render="render"></ListItem>
  </div>
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
  data: Array,
  default: () => []
 }
};
</script>
```

ListItem.vue调用最外层的render方法，将createElement和当前项传递出来
```html
<script>
export default {
 props: {
  render: {
   type: Function
  },
  item: {}
 },
 render(h) {
  return this.render(h, this.item);
 }
};
</script>
```

## 五.scope-slot
使用v-slot 将内部值传即可
```html
<List :arr="arr">
    <template v-slot="{item}">
        {{item}}
    </template>
</List>

<div v-for="(item,key) in arr" :key="key">
    <slot :item="item"></slot>
</div>
```

## 六.编写可编辑表格
基于iview使用jsx扩展成可编辑的表格
```html
<template>
<div>
  <Table :columns="columns" :data="data"></Table>
</div>
</template>
<script>
import Vue from 'vue';
export default {
  methods:{
    render(h,{column,index,row}){
      let value = row[column.key];
      return <div on-click={(e)=>this.changeIndex(e,index)} >
      {this.index === index? 
        <i-input type="text" value={value} on-input={(value)=>{
          this.handleChange(value,column,row)
        }} onOn-enter={()=>this.enter(row,index)}/>:
        <span>{value}</span>
      }
      </div>
    },
    enter(row,index){
      this.data.splice(index,1,row);
      this.index = -1;
    },
    handleChange(value,column,row){
      row[column['key']]= value;
    },
    changeIndex(e,index){
      this.index = index;
      this.$nextTick(()=>{
        e.currentTarget.getElementsByTagName("input")[0].focus()
      })
    }
  },
  data() {
    return {
      index:-1,
      columns: [
        {
          title: 'Name',
          key: 'name',
          render:this.render
        },
        {
          title: 'Age',
          key: 'age',
        },
        {
          title: 'Address',
          key: 'address',
        },
      ],
      data: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
        },
      ],
    };
  },
};
</script>

```


![](https://www.fullstackjavascript.cn/wx.png)