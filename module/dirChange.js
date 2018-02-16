/**
 * Created by sc on 2018/2/4.
 */

const fs = require('fs');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;


const formidable = require('formidable');
const  util = require('util');
const timestamp = require('time-stamp');
const censor = require('sensitive-word-filter');   //敏感词过滤，添加敏感词一个一行。。
const chinaTime = require('china-time');   //获取中文时间


const db = require('../module/db.js');
const paramCheck = require('../module/paramCheck.js');
const myError = require('../module/MyErrorCode.js');

const logDatabase = "logInfo";          //登陆注册数据库名
const dataBase = "Q&A";                 //数据库名
const questionDatabase = "questions";          //提问集合名
const answerDatabase = "answers";           //回答集合名

let images = [];   //存放图片名称的数组

/**
 * 提问表单信息处理
 * @param req
 * @param res
 * @param callback
 */
function questionFormHandle(req,res,callback) {

    let form = new formidable.IncomingForm();

    let upPath = path.normalize('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images');  //路径矫正
    form.uploadDir = upPath;   //设置缓存路径
    form.multiples = true;    //设置多文件上传
    // form.keepExtensions = true;   //设置保留文件后缀,取消此项设置，因为要重命名

    form.on('progress',function(bytesReceived, bytesExpected){
        //打印进度
        console.log(((bytesReceived / bytesExpected)*100)+"% uploaded");});

    form.parse(req, function(err, fields, files) {

        let paramCorrect = paramCheck.questionParam(fields);  //// 键是否正确判断
        if (!paramCorrect) {
            callback(myError.paramError);
            return;
        }

        let userId = fields.user_id.toString().trim();
        let content = fields.content.toString().trim();      //应由前端来做判断

        censord = censor.filter(content);         //将敏感词变为**存入数据库


        if(files.hasOwnProperty("img")){   //若存在字段名为“img”,则表示有图片被上传
            reNameImage(files,"img",upPath);
        }else{                      //没有图片没上传

        }

        let createTime = chinaTime('YYYY-MM-DD HH:mm');   //获取时间（中国），精确到分即可

        db.findDocument(dataBase,logDatabase,{"_id":ObjectId(userId)},{page:0,size:0},(err,data) => {

            if(err){
                images = [];   //清空
                callback(myError.databaseError,null);
                return;
            }else if(data.length == 0){   //用户不存在，不可提问
                images = [];   //清空
                callback(myError.userNotRegisterError,null);
                return;
            }else{              //注册
                db.insertDocument(dataBase,questionDatabase,[{"user_id":userId,"content":censord,"img":images.toString(),"create_time":createTime}],(err,data) => {
                    if(err){
                        images = [];   //清空
                        callback(myError.databaseError,null);
                        return;
                    }else{
                        //成功写入数据库
                        images = [];   //清空
                        callback(null,data.ops[0]);
                        return;
                    }
                })
            }
        });


    });


}


/**
 * 回答表单信息处理
 * @param req
 * @param res
 * @param callback
 */
function answerFormHandle(req,res,callback) {
    let form = new formidable.IncomingForm();

    let upPath = path.normalize('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images');  //路径矫正
    form.uploadDir = upPath;   //设置缓存路径
    form.multiples = true;    //设置多文件上传
    // form.keepExtensions = true;   //设置保留文件后缀,取消此项设置，因为要重命名

    form.on('progress',function(bytesReceived, bytesExpected){
        //打印进度
        console.log(((bytesReceived / bytesExpected)*100)+"% uploaded");});


    form.parse(req, function(err, fields, files) {


        let paramCorrect = paramCheck.answerParam(fields);  //// 键是否正确判断
        if (!paramCorrect) {
            callback(myError.paramError);
            return;
        }
        if(files.hasOwnProperty("img")){   //若存在字段名为“img”,则表示有图片被上传
            reNameImage(files,"img",upPath);
        }else{                      //没有图片没上传

        }

        let userId = fields.user_id.toString().trim();
        let content = fields.content.toString().trim();
        let questionId = fields.question_id.toString().trim();//应由前端来做判断
        censord = censor.filter(content);         //将敏感词变为**存入数据库


        let createTime = chinaTime('YYYY-MM-DD HH:mm');   //获取时间（中国）
        db.findDocument(dataBase,logDatabase,{"_id":ObjectId(userId)},{page:0,size:0},(err,data) => {

            if(err){
                images = [];   //清空
                callback(myError.databaseError,null);
                return;
            }else if(data.length == 0){   //用户不存在，不可提问
                images = [];   //清空
                callback(myError.userNotRegisterError,null);
                return;
            }else{
                db.findDocument(dataBase,questionDatabase,{"_id":ObjectId(questionId)},{page:0,size:0},(err,data)=>{
                    if(err){
                        images = []; //清空
                        callback(myError.databaseError,null);
                        return;
                    }else if(data.length == 0){  //问题不存在
                        images = [];  //清空
                        callback(myError.questionIdExistError,null);
                        return;
                    }else{
                        db.insertDocument(dataBase,answerDatabase,[{"user_id":userId,"content":censord,"question_id":questionId,"img":images.toString(),"create_time":createTime}],(err,data) => {
                            if(err){
                                images = [];   //清空
                                callback(myError.databaseError,null);
                                return;
                            }else{
                                //成功写入数据库
                                images = [];   //清空
                                callback(null,data.ops[0]);
                                return;
                            }
                        })
                    }
                })

            }
        });


    });
}

function uMessageFormHandle(req,res,callback) {
    let form = new formidable.IncomingForm();

    let upPath = path.normalize('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images');  //路径矫正
    form.uploadDir = upPath;   //设置缓存路径
    form.multiples = true;    //设置多文件上传
    // form.keepExtensions = true;   //设置保留文件后缀,取消此项设置，因为要重命名

    form.on('progress',function(bytesReceived, bytesExpected){
        //打印进度
        console.log(((bytesReceived / bytesExpected)*100)+"% uploaded");});


    form.parse(req, function(err, fields, files) {

        let paramCorrect = paramCheck.checkParam("user_id",fields);  //// 键是否正确判断
        if (!paramCorrect) {
            callback(myError.paramError);
            return;
        }

        let userId = fields.user_id.toString().trim();
        let avatar = "";
        let censord = "";
        let age = "";

        db.findDocument(dataBase,logDatabase,{"_id":ObjectId(userId)},{page:0,size:0},(err,data) => {
            if(err){
                images = [];   //清空
                callback(myError.databaseError,null);
                return;
            }else if(data.length == 0){   //用户不存在，不可提问

                images = [];   //清空
                callback(myError.userNotRegisterError,null);
                return;
            }else{
                if(files.hasOwnProperty("avatar")){   //若存在字段名为“avatar”,则表示有图片被上传
                    reNameImage(files,"avatar",upPath);
                    avatar = images[0];
                }else{                                  //值不变
                    avatar = data[0].avatar;
                }
                if(fields.hasOwnProperty("age")){
                    age = fields.age;
                }else{                                  //值不变
                    age = data[0].age;
                }
                if(fields.hasOwnProperty("motto")){
                    censord = censor.filter(fields.motto);
                }else{                                  //值不变
                    censord = data[0].motto;
                }

                db.findDocument(dataBase,logDatabase,{"_id":ObjectId(userId)},{page:0,size:0},(err,data)=>{
                    if(err){
                        images = []; //清空
                        callback(myError.databaseError,null);
                        return;
                    }else if(data.length == 0){  //问题不存在
                        images = [];  //清空
                        callback(myError.userNotRegisterError,null);
                        return;
                    }else{
                        db.updateDocument(dataBase,logDatabase,{"_id":ObjectId(userId)},{"age":age,"motto":censord,"avatar":avatar},(err,data) => {
                            if(err){
                                images = [];   //清空
                                callback(myError.databaseError,null);
                                return;
                            }else{
                                //成功写入数据库
                                images = [];   //清空
                                callback(null,data);
                                return;
                            }
                        })
                    }
                })

            }
        });


    });
}
/**
 * 更改图片名称以及存放路径
 * @param files
 * @param upPath
 */
function reNameImage(files,img,upPath) {
    if(Array.isArray(files[img])){
        for (let image of files[img]) {     //多图片上传
            let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
            let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
            let extname = path.extname(image.name);         //获取后缀名
            let oldPath = image.path;
            let newName = time+rand+extname;
            let newPath = path.join(upPath,newName);

            fs.renameSync(oldPath,newPath);              //同步上传
            images.push(newName);
        }
    }else{                                        //单图片上传
        let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
        let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
        let extname = path.extname(files[img].name);         //获取后缀名
        let oldPath = files[img].path;
        let newName = time+rand+extname;
        let newPath = path.join(upPath,newName);

        fs.renameSync(oldPath,newPath);              //同步上传
        images.push(newName);
    }

}

module.exports = {questionFormHandle,answerFormHandle,uMessageFormHandle};