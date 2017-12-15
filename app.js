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
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//允许的域，设置为任意
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"); //设置允许的header类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next();
});
/**/

app.get('/',(req,res) => {
    res.send("欢迎访问");
});

app.post('/find',router.findData);    //查找接口

app.listen(3000);