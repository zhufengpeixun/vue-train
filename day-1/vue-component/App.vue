<template>
 <Table :columns="columns" :data="data"></Table>
</template>
<script>
export default {
 methods: {
  render(h, { row, column, index }) {
    return <div class="a" on-click={(e)=>this.handleChangeIndex(e,index)}>
    {
        this.currentIndex === index?
        <i-input onOn-enter={()=>this.enter(row, column, index )} value={row[column.key]} on-input={(value)=>this.handleChange(row, column,value)}/>:
        <span>{row[column.key]}</span>
    }
   </div>
  },
  handleChange(row, column,value){
      row[column.key] = value; // 只能自己实现双向数据绑定
  },
  enter(row, column, index){
      this.currentIndex = -1;
      // 修改 把当前索引 这一项 1 改成row
      this.data.splice(index,1,row)
  },    
  handleChangeIndex(e,index){ // 函数的methods 已经被bind过了
    this.currentIndex = index;
    this.$nextTick(()=>{
        e.currentTarget.getElementsByTagName('input')[0].focus();
    })
  }
 },
 data() {
  return {
   currentIndex:-1,
   columns: [
    {
     title: "Name",
     key: "name",
     render: this.render
    },
    {
     title: "Age",
     key: "age"
    },
    {
     title: "Address",
     key: "address"
    }
   ],
   data: [
    {
     name: "John Brown",
     age: 18,
     address: "New York No. 1 Lake Park",
     date: "2016-10-03"
    },
    {
     name: "Jim Green",
     age: 24,
     address: "London No. 1 Lake Park",
     date: "2016-10-01"
    },
    {
     name: "Joe Black",
     age: 30,
     address: "Sydney No. 1 Lake Park",
     date: "2016-10-02"
    },
    {
     name: "Jon Snow",
     age: 26,
     address: "Ottawa No. 2 Lake Park",
     date: "2016-10-04"
    }
   ]
  };
 }
};
</script>