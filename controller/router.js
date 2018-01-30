/**
 * Created by sc on 2017/12/11.
 * 该文件用于路由
 */
const db = require('../module/db.js');
const encrypt = require('../module/md5.js');


//系统运行测试
function ping(req,res,next) {
    return res.send("pang");
}

//注册信息处理
function register(req,res,next) {
    let queryDatabase = req.body.database.trim();       //要查询的数据库
    let queryJson = req.body.queryJson;     //接收接送格式的请求数据
    queryJson[0].password = encrypt.encryption(queryJson[0].password.toString());   //密码用MD5加密

    let findUser = {"user":queryJson[0].user};
    //注册先查找是否存在当前用户名是否已存在
    db.findDocument('Q&A',queryDatabase,findUser,{page:0,size:0},(err,data) => {

        if(err){
            res.send(err);
        }else if(data.length !== 0){   //有数据证明用户名存在，不予注册
            console.log(data);
            res.send(false);
        }else{              //注册
            db.insertDocument('Q&A',queryDatabase,queryJson,(err,data) => {
                if(err){
                    res.send(err);
                    console.log(err);
                }else{
                    res.send(data);        //将查找数据以json格式返回

                }
            })
        }
    })

}

//登录信息处理
function signIn(req,res,next) {
    let queryDatabase = req.body.database.trim();       //要查询的数据库
    let queryJson = req.body.queryJson;     //接收接送格式的请求数据
    queryJson.password = encrypt.encryption(queryJson.password.toString());   //密码用MD5加密
    db.findDocument('Q&A',queryDatabase,queryJson,{page:0,size:0},(err,data) => {
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

//返回请求错误信息  //不得行啊！！！
function errorHandler(err, req, res, next) {
    // res.status(500);
   return res.render('error', { error: err });
}

module.exports = {ping,register,signIn,findData,errorHandler,logOut};