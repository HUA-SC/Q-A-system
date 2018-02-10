/**
 * Created by sc on 2017/12/11.
 * 该文件用于路由
 */

const ObjectId = require('mongodb').ObjectId;

const db = require('../module/db.js');
const encrypt = require('../module/md5.js');
const paramCheck = require('../module/paramCheck.js');
const dirChange = require('../module/dirChange.js');

const database = 'Q&A';                 //数据库名
const logDatabase = "logInfo";          //登陆注册集合名
const questionDatabase = 'questions';   //提问集合名
const answerDatabase = 'answers';       //回答集合名

/**
 * 系统连通性测试
 * @param req
 * @param res
 * @param next
 */
function ping(req,res,next) {
    return res.send("pang");
}

/**
 * 注册信息处理
 * @param req
 * @param res
 * @param next
 */
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
    db.findDocument(database,logDatabase,findUser,{page:0,size:0},(err,data) => {

        if(err){
            res.send(err);
        }else if(data.length !== 0){   //有数据证明用户名存在，不予注册
            res.send("user exist");
            return;
        }else{              //注册
            db.insertDocument(database,logDatabase,[{"user":queryUser,"password":queryPwd,"rank":"0"}],(err,data) => {
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

/**
 * 登录信息处理
 * @param req
 * @param res
 * @param next
 */
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


    db.findDocument(database,logDatabase,{"user":queryUser,"password":queryPwd,"rank":"0"},{page:0,size:0},(err,data) => {
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
    db.findDocument(database,queryDatabase,queryJson,{page:0,size:0},(err,data) => {
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.send(data);        //将查找数据以json格式返回

        }
    })

}

/**
 * 发布问题
 * @param req
 * @param res
 */
function addQuestion(req,res) {
    dirChange.questionFormHandle(req,res,(err) => {
        if(err){
            res.send(err.toString());
            return;
        }
        res.send("提问成功!");
        return;

    });
}

/**
 * 删除提问
 * @param req
 * @param res
 */
function deleteQuestion(req,res) {

    let paramCorrect = paramCheck.checkParam('question_id',req.body);
    if(!paramCorrect){
        res.send("参数错误！");
        return ;
    }
    let questionId = req.body.question_id;  //待删除问题_id
    db.deleteDocument(database,questionDatabase,{"_id":ObjectId(questionId)},(err,data) => {
        if(err){
            res.send("连接数据库失败！");
            return;
        }
        res.send("删除成功！");
        return ;
    })

}

/**
 * 发布回答
 * @param req
 * @param res
 */
function addAnswer(req,res) {

    dirChange.answerFrmHandle(req,res,(err) => {
        if(err){
            res.send(err.toString());
            return;
        }
        res.send("提问成功!");
        return;
    })
}

/**
 * 删除回答
 * @param req
 * @param res
 */
function deleteAnswer(req,res) {
    let paramCorrect = paramCheck.checkParam('answer_id',req.body);
    if(!paramCorrect){
        res.send("参数错误！");
        return ;
    }
    let answerId = req.body.answer_id;  //待删除问题_id
    db.deleteDocument(database,answerDatabase,{"_id":ObjectId(answerId)},(err,data) => {
        if (err) {
            res.send("连接数据库失败！");
            return;
        }
        res.send("删除成功！");
        return
    });
}

//返回请求错误信息  //不得行啊！！！
function errorHandler(err, req, res, next) {
    // res.status(500);
   return res.render('error', { error: err });
}

module.exports = {
                    ping,register,signIn,findData,
                    errorHandler,addQuestion,addAnswer,
                    deleteQuestion,deleteAnswer
                  };