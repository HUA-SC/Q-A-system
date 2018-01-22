/**
 * Created by sc on 2017/12/11.
 * 后台主入口文件app.js
 */

const express = require("express");  //使用express框架
const app = express();          //创建express入口函数
const session = require('express-session');  //导入session
const bodyParser = require('body-parser');   //该中间件用于post请求的接收
const router = require('./controller/router.js');//导入路由模块

/*中间件的使用-start*/
//设置express的session
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true ,maxAge: 1000 * 60 * 30}, //maxAge是session和相应的cookie失效过期时间（这里为30min），以ms为单位（任何低于60s(60000ms)的设置是没有用的）,如果maxAge不设置，默认为null，这样的expire的时间就是浏览器的关闭时间，即每次关闭浏览器的时候，session都会失效。
//     store: new MongoStore({   //创建新的mongodb数据库
//       host: 'localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
//       port: 27017,          //数据库的端口号
//       db: 'test-app'        //数据库的名称。
//      })
// }));

// for parsing application/json
app.use(bodyParser.json());

//跨域请求配置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//允许的域，设置为任意
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"); //设置允许的header类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  //设置允许跨域的方法
    res.header("X-Powered-By",' 3.2.1');
    next();
});

//处理注册信息的接口
app.post('/register',router.register);

//处理登录信息的接口
app.post('/logIn',router.signIn);

//用于查找的接口
app.post('/find',router.findData);

//接下不满足上述所有接口的请求，并返回错误提示
app.use(router.errorHandler);

/*中间件的使用-end*/
app.listen(3000);