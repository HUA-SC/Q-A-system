/**
 * Created by sc on 2018/2/1.
 */

function logParam(obj){
    if(obj.hasOwnProperty("user") && obj.hasOwnProperty("password")){
        //do nothing
    }else{
        return false;
    }
    return true;
}

module.exports = {logParam};