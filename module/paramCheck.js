/**
 * Created by sc on 2018/2/1.
 */

/**
 * 判断登录注册json数据中是否存在必要属性
 * @param obj
 * @returns {boolean}
 */
function logParam(obj){
    if(obj.hasOwnProperty("user") && obj.hasOwnProperty("password")){
        //do nothing
    }else{
        return false;
    }
    return true;
}

/**
 * 判断提问json数据中是否存在必要属性
 * @param obj
 * @returns {boolean}
 */
function questionParam(obj){
    if(obj.hasOwnProperty("content") && obj.hasOwnProperty("user_id") && obj.hasOwnProperty("courseId") && obj.hasOwnProperty("title")){
        // do nothing
    }else{
        return false;
    }
    return true;
}

/**
 * 判断回答json数据中是否存在必要属性
 * @param obj
 * @returns {boolean}
 */
function answerParam(obj) {
    if(obj.hasOwnProperty("user_id") && obj.hasOwnProperty("content") && obj.hasOwnProperty("question_id"))   {
        // do nothing
    } else{
        return false;
    }
    return true;
}

/**
 * 单参数-传参正确性判断
 * @param str
 * @param obj
 * @returns {boolean}
 */
function checkParam(str,obj) {
    if(obj.hasOwnProperty(str)){
        // do nothing
    }else{
        return false;
    }
    return true;
}

module.exports = {logParam,questionParam,answerParam,checkParam};