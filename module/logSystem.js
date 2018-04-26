
function log(req,res){
    let log = {};
    log.time = new Date();
    log.method = req.method;
    log.url = req.url;
    // log.header = req.headers;
    if (req.method.toLowerCase() === 'post'){           //若数据时multipart/form-data，不记录数据内容
        log.queryData = req.body;
    }
    console.log(JSON.stringify(log))
}

module.exports = {log};