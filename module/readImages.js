/**
 * Created by sc on 2017/11/1.
 */
/**
 * 用于文件处理的模块
 */

const fs = require('fs');
const path = require('path');

const encodeImageStream = require('encode-image-stream');    //将图片编码为base64
const concatStream = require('concat-stream');              //将图片编码为base64

const myError = require('./MyErrorCode.js');

/**
 * 根据图片路径查找图片（是否存在）
 * @param targetDir
 * @param targetImg
 * @param callback
 */
function searchFile(targetDir,targetImg,callback){

    // let target = path.join('../upload')
    fs.readFile(path.join(targetDir,targetImg),(err,files) => {
        if(err){
            //图片不存在，返回该图片路径，在上层报错
            callback(`${path.join(targetDir,targetImg)}`);
            return;
        }else{
            callback(null);
            return;
        }
    })
}

/**
 * 以流的形式读取图片数据，并编码为base64返回
 * @param targetDir
 * @param targetImg
 * @param callback
 */
function searchPhoto(targetDir,targetImg,callback){
    fs.createReadStream(path.join(targetDir,targetImg))   //以流形式读取图片
        .pipe(encodeImageStream())                        //编码为base64
        .pipe(concatStream(function (buf) {
            // console.log(buf.toString('utf-8'))
            //=> 'Otd5ZjqqfN9tVWcwMG9sLgqvJYSnyOAOIh'
            return callback(buf.toString('utf-8'));
        }));
}

/**
 * 创建文件夹，未使用
 * @param fileName
 */
function doCreate(fileName) {
   fs.mkdirSync(path.join('./','/upload',fileName));

}

/**
 * 根据存放图片名的数组，读取图片并编码为base64，存放在数组中返回
 * @param images
 * @param callback
 */
function readImage(images, callback) {
    let binaryImages = [];   //存放二进制格式的图片数据

    //异步迭代,从0开始
    (function iterator(i) {
        if (i === images.length) {    //当所有异步回调完成时，callback
            callback(null,binaryImages);
            return;
        }
        searchFile('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images', images[i], (err) => {
            if (err) {
                myError.imageExistErro.msg = err + myError.imageExistErro.msg;
                callback(myError.imageExistErro,null);
                return;
            }
            searchPhoto('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images', images[i], (imageBase64) => {
                binaryImages.push(imageBase64);
                iterator(i + 1);     //异步回调中迭代
            });
        });

    })(0);

}


module.exports = {searchFile,searchPhoto,doCreate,readImage};