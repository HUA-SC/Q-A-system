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

    db.insertDocument('Q&A',queryDatabase,queryJson,(err,data) => {
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.send(data);        //将查找数据以json格式返回

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

module.exports = {register,findData,errorHandler};