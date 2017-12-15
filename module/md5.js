/**
 * Created by sc on 2017/11/16.
 */
const crypto = require('crypto');

function encryption(pwd) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(pwd).digest('base64');
    return password;
}

module.exports = {encryption};