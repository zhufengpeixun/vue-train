const express = require('express');

const app = express();
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.get('/roleAuth', (req, res) => {
  res.json({
    menuList: [
      {
        pid: -1,
        name: '购物车',
        id: 1,
        auth: 'cart',
      },
      {
        pid: 1,
        name: '购物车列表',
        id: 4,
        auth: 'cart-list',
      },
      {
        pid: 4,
        name: '彩票',
        id: 5,
        auth: 'lottery',
      },
      {
        pid: 4,
        name: '商品',
        id: 6,
        auth: 'product',
      },
    ],
  });
});
app.listen(3000);
