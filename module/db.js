/**
 * Created by sc on 2017/11/8.
 */
/**
 * Created by sc on 2017/11/6.
 */

const path =require('path');
const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

// Connection URL
const host = '118.24.83.20:27017';
const database = '/' ;

const url =  'mongodb://' + host + database;


//封装插入语句
function insertDocument (coll,document,jsonArr,callback) {

    // Use connect method to connect to the Server

    let url = 'mongodb://' + host + database + coll;

    MongoClient.connect(url, (err, db) => {

        if(err) {
            callback(new Error("连接数据库失败！"),null);
            db.close();
            return;
        }

        // console.log("连接到数据库");

        // Get the documents collection
        let collection = db.collection(document.toString());

        // Insert some documents
        collection.insertMany(jsonArr, (err, result) => {

            if(err) {
                callback(new Error(`插入集合${document}失败！`),null);
                db.close();
                return;
            }
            // console.log(`Inserted ${result.ops.length} documents into the document collection`);
            callback(null,result);
            // console.log(result);
            db.close();
            return;
        });

    });

}

//封装查询语句
function findDocument(coll,document,jsonArr,pageObj,callback) {

    let url = 'mongodb://' + host + database + coll;
    MongoClient.connect(url, (err, db) => {

        if (err) {
            callback(new Error("连接数据库失败！"), null);
            db.close();
            return;
        }
        // console.log('成功连接数据库！');
       // var collection = db.collection(document.toString());

        let collection = db.collection(document.toString());
        //分页

        let pageLimit = pageObj.size;
        let pageSkip = (pageObj.page-1) * pageObj.size;



        // Find some documents
        collection.find(jsonArr).limit(pageLimit).skip(pageSkip).toArray(function (err, docs) {
            if (err) {
                callback(new Error(`查找集合${document}失败！`), null);
                db.close();
                console.log(err);
                return;
            }
            // console.log(`Found ${docs.length} records`);
            callback(null, docs);
            db.close();
            return;
        })
    });

}

//封装删除语句
function deleteDocument(coll,document,jsonArr,callback) {

    let url = 'mongodb://' + host + database + coll;
    MongoClient.connect(url,(err, db) => {

        if (err) {
            callback(new Error("连接数据库失败！"), null);
            db.close();
            return;
        }
        // Get the documents collection
        let collection = db.collection(document.toString());
        // Insert some documents
        collection.deleteMany(jsonArr, function(err, result) {

            if (err || result.result.n !== 1) { // assert.equal(1, result.result.n);

                callback(new Error("删除数据失败！"), null);
                db.close();
                return;
            }

            // console.log(`Removed the document`);
            callback(null,result);
            db.close();
            return;
        });
    })
}

//封装修改语句
function updateDocument(coll,document,queryJson,updataJson,callback) {


    let url = 'mongodb://' + host + database + coll;
    MongoClient.connect(url, (err, db) => {
        if (err) {
            callback(new Error("连接数据库失败！"), null);
            db.close();
            return;
        }

        let collection = db.collection(document.toString());

        // Update document where a is 2, set b equal to 1
        collection.updateOne(queryJson
            , { $set: updataJson }, (err, result) => {

                if (err || result.result.n !== 1) { // assert.equal(1, result.result.n);
                    callback(new Error("修改数据失败！"), null);
                    db.close();
                    return;
                }

                // console.log("Updated the document");
                callback(null,result);
                db.close();
                return;
            });
    });
}

module.exports = {insertDocument,findDocument,deleteDocument,updateDocument};