/**
 * Created by sc on 2017/11/1.
 */
/**
 * 用于文件处理的模块
 */

const fs = require('fs');
const path = require('path');


function searchFile(callback){

    // let target = path.join('../upload')
    fs.readdir('upload',(err,files) => {
        if(err){console.log(err);
            callback(new Error(`读取文件夹images失败`),null);
            return;
        }
        let albums = [];

        // 循环内部有递归调用函数，使用递归会比较好,所以使用迭代器
        (function iterator(i) {
            if(i === files.length){
                callback(null,albums);
                return;
            }
            fs.stat(path.join('upload',files[i]),(err,stats) => {
                if(stats.isDirectory()){
                    albums.push(files[i]);
                }
                iterator(i+1);
            })
        })(0)
    })
}

function searchPhoto(targetDir,callback){
    fs.readdir(path.join('./','/upload',targetDir),(err,files) => {
        if(err){
            callback(new Error(`读取文件${targetDir}失败`),null);
            return;
        }
        callback(null,files);
        return;
    })

}

function doCreate(fileName) {
   fs.mkdirSync(path.join('./','/upload',fileName));

}


module.exports = {searchFile,searchPhoto,doCreate};