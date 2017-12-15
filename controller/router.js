/**
 * Created by sc on 2017/12/11.
 */
const db = require('../module/db.js');


function login(req,res,next) {

    var queryJson = req.body;     //接收接送格式的请求数据
    console.log(queryJson);
    db.findDocument('Q&A','logInfo',queryJson,{page:0,size:0},(err,data) => {
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.send(data);        //将查找数据以json格式返回

        }
    })

}

module.exports = {login};