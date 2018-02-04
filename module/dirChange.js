/**
 * Created by sc on 2018/2/4.
 */

const fs = require('fs');
const path = require('path');

const formidable = require('formidable');
const  util = require('util');
const timestamp = require('time-stamp');

const paramCheck = require('../module/paramCheck.js');
/**
 * 更改图片路径与名称
 * @param req
 * @param res
 * @param callback
 */

function formHandle(req,res,callback) {

    let form = new formidable.IncomingForm();

    let upPath = path.normalize('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images');  //路径矫正
    form.uploadDir = upPath;   //设置缓存路径
    form.multiples = true;    //设置多文件上传
    // form.keepExtensions = true;   //设置保留文件后缀,取消此项设置，因为要重命名

    form.parse(req, function(err, fields, files) {

        let paramCorrect = paramCheck.questionParam(fields);
        if(!paramCorrect){
            res.send("提问表单属性出错");
            callback();
            return;
        }

        if(files.hasOwnProperty("img") && files){   //有图片被上传，且字段名为“img”
            reNameImage(files,upPath);
        }else if(! files.hasOwnProperty("img")){    //没有图片被上传

        }else{                                      //有img这个字段，但没有数据
            res.send("没有图片数据!");
        }
        callback();
        return;
    });


}

function reNameImage(files,upPath) {
    if(Array.isArray(files.img)){
        for (let image of files.img) {     //多图片上传
            let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
            let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
            let extname = path.extname(image.name);         //获取后缀名
            let oldPath = image.path;
            let newPath = path.join(upPath,time+rand+extname);
            fs.renameSync(oldPath,newPath);              //同步上传
        }
    }else{                                        //单图片上传
        let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
        let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
        let extname = path.extname(files.img.name);         //获取后缀名
        let oldPath = files.img.path;
        let newPath = path.join(upPath,time+rand+extname);

        console.log(newPath);
        console.log(oldPath);
        fs.renameSync(oldPath,newPath);              //同步上传
    }

}
module.exports = {formHandle};