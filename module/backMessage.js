/**
 * Created by sc on 2018/2/12.
 */

/*返回信息格式及初始值*/
var message = {
    code:'0',
    msg:'success!',
    result:'no result'
};

/**
 * 设置返回信息
 * @param code
 * @param msg
 * @param result
 * @returns {{code: string, msg: string, result: string}}
 */
function back(code, msg, result) {
    message.code = code || message.code;
    message.msg = msg || message.msg;
    message.result = result || message.result;

    return message;
}
module.exports = {back,message};