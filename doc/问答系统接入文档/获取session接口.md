### 获取session内容
/query/session      

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "userData": {
            "cookie": {
                "originalMaxAge": 60000,
                "expires": "2018-03-20T13:55:39.020Z",
                "secure": false,
                "httpOnly": true,
                "path": "/"
            },
            "user": "user2",
            "captcha": "Tz9XK"
        }
    }
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | {"userData": 用户session数据} | 获取session成功
00001 | 系统错误 | 空| 获取session失败
10003 | 没有session数据! | 空 | 获取session失败，用户未登录

[session 数据说明]  

key | value |
------- | ------- |
cookie|cookie设置信息，该信息可以忽略
user| 当前登录用户的用户名
captcha|验证码图片对应验证数据，当请求验证码接口时，会将该数据存于session


