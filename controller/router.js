/**
 * Created by sc on 2017/12/11.
 */
const db = require('../module/db.js');


function findData(req,res,next) {

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

module.exports = {findData};