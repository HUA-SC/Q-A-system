/**
 * Created by sc on 2017/12/11.
 * 该文件用于路由
 */
const formidable= require('formidable');  //导入表单处理插件formidable
util = require('util');

const db = require('../module/db.js');
const encrypt = require('../module/md5.js');
const paramCheck = require('../module/paramCheck.js');
const dirChange = require('../module/dirChange.js');

const logDatabase = "logInfo";          //登陆注册数据库名

//系统运行测试
function ping(req,res,next) {
    return res.send("pang");
}

//注册信息处理
function register(req,res,next) {
    let paramCorrect = paramCheck.logParam(req.body);   // 键是否正确判断
    if(! paramCorrect){
        res.send("wrong json key! 检查json");
        return ;
    }

    let queryUser = req.body.user.trim().toString();
    let queryPwd = req.body.password.trim().toString();
    if(!queryUser || ! queryPwd){
        res.send("用户名或密码为空！");
        return;
    }
    queryPwd = encrypt.encryption(queryPwd);   //密码用MD5加密

    let findUser = {"user":queryUser};
    //注册先查找是否存在当前用户名是否已存在
    db.findDocument('Q&A',logDatabase,findUser,{page:0,size:0},(err,data) => {

        if(err){
            res.send(err);
        }else if(data.length !== 0){   //有数据证明用户名存在，不予注册
            res.send("user exist");
            return;
        }else{              //注册
            db.insertDocument('Q&A',logDatabase,[{"user":queryUser,"password":queryPwd,"rank":"0"}],(err,data) => {
                if(err){
                    res.send(err);
                    return;
                }else{
                    res.send(data);        //将查找数据以json格式返回
                    return;
                }
            })
        }
        return;
    })

}

//登录信息处理
function signIn(req,res,next) {
    // let queryDatabase = req.body.database.trim();       //要查询的数据库
    // let queryJson = req.body.queryJson;     //接收接送格式的请求数据



    let paramCorrect = paramCheck.logParam(req.body);   // 键是否正确判断
    if(! paramCorrect){
        res.send("wrong json key! 检查json");
        return ;
    }


    let queryUser = req.body.user.trim().toString();
    let queryPwd = req.body.password.trim().toString();
    if(!queryUser || ! queryPwd){
        res.send("用户名或密码为空！");
        return;
    }
    queryPwd = encrypt.encryption(queryPwd);   //密码用MD5加密


    db.findDocument('Q&A',logDatabase,{"user":queryUser,"password":queryPwd,"rank":"0"},{page:0,size:0},(err,data) => {
        if(err){
            res.send(err);
            console.log(err);
        }else{
            // req.session.user = queryJson.user;
            // console.log(req.session.user);
            // res.locals.session=req.session;
            res.send(data);        //将查找数据以json格式返回
        }
    })

}

//登出信息处理
// function logOut(req,res,next) {
//     req.session.destroy();    // session置空
// }

//查找数据  //作用待定！！！！！
function findData(req,res) {

    let queryDatabase = req.body.database.trim();       //要查询的数据库
    let queryJson = req.body.queryJson;     //接收接送格式的请求数据
    console.log(queryJson);
    db.findDocument('Q&A',queryDatabase,queryJson,{page:0,size:0},(err,data) => {
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.send(data);        //将查找数据以json格式返回

        }
    })

}

//问题发布
function addQuestion(req,res) {
    dirChange.formHandle(req,res,(err) => {
        if(err){
            res.send(err.toString());
            return;
        }
        res.send("提问成功!");
        return;

    });
}


//返回请求错误信息  //不得行啊！！！
function errorHandler(err, req, res, next) {
    // res.status(500);
   return res.render('error', { error: err });
}

module.exports = {ping,register,signIn,findData,errorHandler,addQuestion};