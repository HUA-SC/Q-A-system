/**
 * Created by sc on 2017/12/11.
 * 该文件用于路由
 */

const ObjectId = require('mongodb').ObjectId;
const censor = require('sensitive-word-filter');   //关键字过滤
const svgCaptcha = require('svg-captcha');          //验证码生成中间件


const db = require('../module/db.js');
const encrypt = require('../module/md5.js');
const paramCheck = require('../module/paramCheck.js');
const dirChange = require('../module/dirChange.js');
const backMessage = require('../module/backMessage.js');
const myError = require('../module/MyErrorCode.js');
const myImageReader = require('../module/readImages.js');
const logSystem = require('../module/logSystem.js');

const database = 'Q&A';                 //数据库名
const logDatabase = "logInfo";          //登陆注册信息存放数据集合名
const questionDatabase = 'questions';   //提问信息存放数据集合名
const answerDatabase = 'answers';       //回答信息存放数据集合名
const coursesDatabase = 'courses';       //课程信息存放数据集合名

/**
 * 系统连通性测试
 * @param req
 * @param res
 * @param next
 */
function ping(req, res, next) {
    return res.send("pang");


}

/**
 * 注册信息处理
 * @param req
 * @param res
 * @param next
 */
function register(req, res, next) {
    let paramCorrect = paramCheck.logParam(req.body);   // 键是否正确判断
    if (!paramCorrect) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let queryUser = req.body.user.trim().toString();
    let queryPwd = req.body.password.trim().toString();
    if (!queryUser || !queryPwd) {
        return res.json(backMessage.back(myError.signError.code, myError.signError.msg));

    }

    censord = censor.filter(queryUser);
    if (queryUser !== censord) {
        //注册用户名包含敏感信息
        return res.json(backMessage.back(myError.signCensorError.code, myError.signCensorError.msg));

    }


    queryPwd = encrypt.encryption(queryPwd);   //密码用MD5加密
    let findUser = {"user": queryUser};
    //注册先查找是否存在当前用户名是否已存在
    db.findDocument(database, logDatabase, findUser, {page: 0, size: 0}, (err, data) => {

        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length !== 0) {   //有数据证明用户名存在，不予注册
            return res.json(backMessage.back(myError.signExistError.code, myError.signExistError.msg));

        } else {              //注册
            db.insertDocument(database, logDatabase, [{
                "user": queryUser,
                "password": queryPwd,
                "rank": "0",
                "age": "",
                "img": "a.jpg",
                "motto": ""
            }], (err) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                } else {
                    return res.json(backMessage.back());

                }
            })
        }
    });
    return;
}

/**
 * 获取验证码信息
 * @param req
 * @param res
 */
function captcha(req, res, next) {
    let captcha = svgCaptcha.create({
        size: 5,                                        // 验证码长度
        ignoreChars: '0o1i',                            // 验证码字符中排除 0o1il
        noise: 2,                                       // 干扰线条的数量
        height: 44
    });
    req.session.captcha = captcha.text;                     //验证码信息放于session传回
    return res.send(captcha.data);                                 //验证码svg图片传回
}

/**
 * 登录信息处理
 * @param req
 * @param res
 * @param next
 */
function signIn(req, res, next) {

    let _session = req.session;

    let paramCorrect = paramCheck.logParam(req.body);   // 键是否正确判断
    if (!paramCorrect) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }


    let queryUser = req.body.user.trim().toString();
    let queryPwd = req.body.password.trim().toString();
    if (!queryUser || !queryPwd) {
        // console.log(backMessage.message.result);
        return res.json(backMessage.back(myError.signError.code, myError.signError.msg));
    }
    queryPwd = encrypt.encryption(queryPwd);   //密码用MD5加密


    db.findDocument(database, logDatabase, {"user": queryUser, "password": queryPwd, "rank": "0"}, {
        page: 0,
        size: 0
    }, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length === 0) {
            return res.json(backMessage.back(myError.userNotRegisterError.code, myError.userNotRegisterError.msg));

        } else {
            if (data[0].hasOwnProperty('img') && data[0].img !== "") {
                //split将string转换还为数组
                myImageReader.readImage(data[0].img.split(','), (err, binaryImages) => {
                    if (err) {
                        return res.json(backMessage.back(err.code, err.msg));
                    }
                    data[0].img = binaryImages;   //将有图片的换为base64编码的格式

                    // console.log(data[0].user + " log in data[0]");
                    // console.log(JSON.stringify(req.session) + " log in session");
                    _session.user = data[0].user;
                    // console.log(JSON.stringify(_session) + " ok session");
                    return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

                });
            } else {
                _session.user = data[0].name;
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

            }
        }
    });
    return;

}

/**
 * 登出信息处理
 * @param req
 * @param res
 * @param next
 */
function logOut(req, res, next) {
    req.session.destroy();    // session置空
    return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg));

}

/**
 * 获取session
 * @param req
 * @param res
 * @param next
 */
function querySession(req, res, next) {
    if (req.session.user || req.session.captcha) {
        return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, {"userData": req.session}));

    } else {
        return res.json(backMessage.back(myError.noSessionError.code, myError.noSessionError.msg));

    }
    return;
}

/**
 * 用户个人设置
 * @param req
 * @param res
 */
function setUserMessage(req, res, next) {
    dirChange.uMessageFormHandle(req, res, (err, data) => {
        if (err) {
            return res.json(backMessage.back(err.code, err.msg));

        }
        return res.json(backMessage.back());

    })

}

/**
 * 发布问题
 * @param req
 * @param res
 */
function addQuestion(req, res, next) {
    dirChange.questionFormHandle(req, res, (err, data) => {
        if (err) {
            return res.json(backMessage.back(err.code, err.msg));


        }
        if (data.hasOwnProperty('img') && data.img !== "") {
            //split将string转换还为数组
            myImageReader.readImage(data.img.split(','), (err, binaryImages) => {
                if (err) {
                    return res.json(backMessage.back(err.code, err.msg));


                }
                data.img = binaryImages;   //将有图片的换为base64编码的格式
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

            });
        } else {
            return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

        }
    });
    return;
}

/**
 * 删除提问
 * @param req
 * @param res
 */
function deleteQuestion(req, res, next) {

    let paramCorrect = paramCheck.checkParam('question_id', req.body);
    if (!paramCorrect) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }
    let questionId = req.body.question_id;  //待删除问题_id


    db.findDocument(database, questionDatabase, {"_id": ObjectId(questionId)}, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length == 0) { //问题id不存在
            return res.json(backMessage.back(myError.questionIdExistError.code, myError.questionIdExistError.msg));
        } else {
            db.deleteDocument(database, questionDatabase, {"_id": ObjectId(questionId)}, (err, data) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                }
                return res.json(backMessage.back());  //提问删除成功

            })
        }
    });

    return;
}

/**
 * 发布回答
 * @param req
 * @param res
 */
function addAnswer(req, res, next) {

    dirChange.answerFormHandle(req, res, (err, data) => {
        if (err) {
            return res.json(backMessage.back(err.code, err.msg));

        }
        if (data.hasOwnProperty('img') && data.img !== "") {
            //split将string转换还为数组
            myImageReader.readImage(data.img.split(','), (err, binaryImages) => {
                if (err) {
                    return res.json(backMessage.back(err.code, err.msg));


                }
                data.img = binaryImages;   //将有图片的换为base64编码的格式
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

            });
        } else {
            return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

        }
    });
    return;
}

/**
 * 删除回答
 * @param req
 * @param res
 */
function deleteAnswer(req, res, next) {
    let paramCorrect = paramCheck.checkParam('answer_id', req.body);
    if (!paramCorrect) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }
    let answerId = req.body.answer_id;  //待删除问题_id

    db.findDocument(database, answerDatabase, {"_id": ObjectId(answerId)}, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length == 0) {  //问题不存在
            return res.json(backMessage.back(myError.answerIdExistError.code, myError.answerIdExistError.msg));

        } else {
            db.deleteDocument(database, answerDatabase, {"_id": ObjectId(answerId)}, (err, data) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                }
                return res.json(backMessage.back());   //删除成功

            });
        }
    });
    return;
}

/**
 * 通用数据查询接口
 * 传入参数应包括查询集合名称
 * @param req
 * @param res
 */
function findData(req, res, next) {

    if (!paramCheck.checkParam('collection', req.body) && !paramCheck('queryJson', req.body)) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let queryDatabase = req.body.collection.trim();       //要查询的数据库
    let queryJson = req.body.queryJson;     //接收接送格式的请求数据

    if (queryJson.hasOwnProperty('_id')) {
        queryJson._id = ObjectId(queryJson._id);
    }
    db.findDocument(database, queryDatabase, queryJson, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else {
            console.log(data);


            (function iterator(i) {
                if (i === data.length) {
                    return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg, data));

                }
                if (data[i].hasOwnProperty('img') && data[i].img !== "") {
                    //split将string转换还为数组
                    myImageReader.readImage(data[i].img.split(','), (err, binaryImages) => {
                        if (err) {
                            return res.json(backMessage.back(err.code, err.msg));

                        }
                        data[i].img = binaryImages;   //将有图片的换为base64编码的格式
                        iterator(i + 1);
                    });
                } else {
                    iterator(i + 1);
                }

            })(0);


        }
    })

}

/**
 * 添加课程信息
 * @param req
 * @param res
 */
function addCourse(req, res, next) {

    if (!paramCheck.checkParam('course', req.body)) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let course = req.body.course.trim();

    if (course === '') {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let findCourse = {'course': course};
    db.findDocument(database, coursesDatabase, findCourse, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length !== 0) {
            return res.json(backMessage.back(myError.courseExistError.code, myError.courseExistError.msg));

        } else {
            db.insertDocument(database, coursesDatabase, [{'course': course}], (err, data) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                }
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg));


            })
        }
    });

    return;
}

/**
 * 修改课程信息
 * @param req
 * @param res
 */
function updateCourse(req, res, next) {
    if (!paramCheck.checkParam('course', req.body) || !paramCheck.checkParam('courseId', req.body)) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let course = req.body.course.trim();
    let courseId = req.body.courseId.trim();

    if (course === '' || courseId === '') {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let findCourse = {'course': course};
    db.findDocument(database, coursesDatabase, findCourse, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length === 1) {
            if (data[0]._id.toString() === courseId) {          //未作任何修改
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg));

            }
            //修改的课程名称，已经存在了
            return res.json(backMessage.back(myError.courseExistError.code, myError.courseExistError.msg));

        } else {
            db.updateDocument(database, coursesDatabase, {'_id': ObjectId(courseId)}, {'course': course}, (err, data) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                }
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg));


            })
        }
    });
    return;
}

/**
 * 删除课程信息
 * @param req
 * @param res
 */
function deleteCourse(req, res, next) {
    if (!paramCheck.checkParam('course', req.body)) {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let course = req.body.course.trim();
    if (course === '') {
        return res.json(backMessage.back(myError.paramError.code, myError.paramError.msg));

    }

    let findCourse = {'course': course};
    db.findDocument(database, coursesDatabase, findCourse, {page: 0, size: 0}, (err, data) => {
        if (err) {
            return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

        } else if (data.length === 0) {
            return res.json(backMessage.back(myError.coursesNotFound.code, myError.coursesNotFound.msg));

        } else {
            db.deleteDocument(database, coursesDatabase, {'course': course}, (err, data) => {
                if (err) {
                    return res.json(backMessage.back(myError.databaseError.code, myError.databaseError.msg));

                }
                return res.json(backMessage.back(backMessage.message.code, backMessage.message.msg));


            })
        }
    });
    return;
}

/**
 * 承接系统报错的中间件
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler(err, req, res, next) {
    console.log(err + "err");
    return res.json({'code': '00001', 'msg': '系统错误', 'result': err.stack});

}

function checkLog(req,res,next) {
    let url = req.url;
    let method = req.method.toLowerCase();
    if (method === 'post'){                                 //所有post数据除了'/login'、 'register'、'/query/session'这三个接口，其余均需要登录后才可以使用
        if (url !== '/login' && url !== '/register' && url !== '/query/session' ){
            if (! req.session.user){
                return res.send(backMessage.back(myError.notLogIn.code,myError.notLogIn.msg));
            }else{
                 return next();
            }
        }
    }
    return next();

}
module.exports = {
    ping, register, signIn, findData,
    errorHandler, addQuestion, addAnswer,
    deleteQuestion, deleteAnswer, setUserMessage,
    logOut, querySession, captcha, addCourse, updateCourse,
    deleteCourse,checkLog
};