/**
 * Created by sc on 2017/12/11.
 * 该文件用于路由
 */
const db = require('../module/db.js');
const encrypt = require('../module/md5.js');



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
            res.send(data);        //将查找数据以json格式返回
            if(data.user === queryJson.user){
                req.session
            }
        }
    })

}

//查找数据
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

//返回请求错误信息
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

module.exports = {register,signIn,findData,errorHandler};