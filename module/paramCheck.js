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

function questionParam(obj){
    if(obj.hasOwnProperty("content") && obj.hasOwnProperty("user_id")){
        // do nothing
    }else{
        return false;
    }
    return true;
}
module.exports = {logParam,questionParam};