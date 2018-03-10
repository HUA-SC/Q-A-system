# 棋哥教学网问答系统后台接入文档

### 系统连通性测试接口（GET）
/root/ping  

[出参]
```
"pang"  
```

### 注册接口（POST）
/register
 
[入参示例]
```
{"user": "user3", "password": "123456"}
```
[入参说明]

| user | password|
| ------ | ------ |
| 用户名 | 密码 |

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "user": "user4",
        "password": "4QrcOUm6Wau+VuBX8g+IPg==",
        "rank": "0",
        "age": "",
        "avatar": [
            "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYn"
        ],
        "motto": "",
        "_id": "5a86d3269bca952c109b9679"
    }
}
```
[出参说明]

| code | msg  | result | 说明|
|------- | ------- | ------- |---- |
| 0 | sucess | 返回用户信息 | 注册成功|
| 00001 | 系统错误 | 空| 注册失败|
| 00002 | 参数格式不正确 |空| 注册失败|
| 10000 | 用户名或密码不可为空 | 空| 注册失败|
| 10001 | 该用户名已被注册 | 空| 注册失败|
| 10002 | 警告！用户名中存在敏感词语！ | 空| 注册失败|
| 40000 | 数据库连接失败|空|注册失败|

### 登录接口（POST）
/login  

[入参示例]
```
 {"user": "user1", "password": "123456"}
```
[入参说明]

user | password
------- | -------
用户名 | 密码
[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "user": "user4",
        "password": "4QrcOUm6Wau+VuBX8g+IPg==",
        "rank": "0",
        "age": "",
        "avatar": [
            "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYn"
        ],
        "motto": "",
        "_id": "5a86d3269bca952c109b9679"
    }
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 返回用户信息 | 登录成功
00001 | 系统错误 | 空| 登录失败
00002 | 参数格式不正确 |空| 登录失败
10000 | 用户名或密码不可为空 | 空|登录失败
20000 | 该用户未注册，无法找到！ | 空|登录失败
40000 | 数据库连接失败|空|登录失败

### 登出接口
/logOUt

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": "no result"
}
```

[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 空 | 登出成功
00001 | 系统错误 | 空| 登出失败


### 获取session内容
/query/session      

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "user": "user1"
    }
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | {"user": 用户名} | 获取session成功
00001 | 系统错误 | 空| 获取session失败
10003 | 没有session数据! | 空 | 获取session失败

### 个人信息设置接口（POST）
/setting/user   
[入参示例]
```
"user_id":"5a86c7b49bca952c109b9671"
"age":"11"
"motto":"成功是失败之母"
"avatar":
```
[入参说明]

user_id | age|motto | img
------- | ------- | -------|-----    
用户的唯一id | 年龄（可为空）|座右铭（可为空）| 头像（可为空）
[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": "no result"
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 无| 设置成功
00001 | 系统错误 | 空| 设置失败
00002 | 参数格式不正确 |空| 设置失败
20000 | 该用户未注册，无法找到！ | 空|设置失败
40000 | 数据库连接失败|空|设置失败
### 提问接口（POST）
/add/question   

[入参示例]
提问时以表单形式提交
```
"user_id":"5a86c7e69bca952c109b9672",
"content":"session是什么？"
"img":
```
[入参说明]

user_id | content | img
------- | ------- | -------
提问用户的唯一id | 提问内容 | 提问说明用一张或多张图片（可为空）

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "user_id": "5a86c7b49bca952c109b9671",
        "content": "什么是cookie?",
        "img": [ "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYn"],
        "create_time": "2018-02-22 11:15",
        "_id": "5a8e35cd48969f48a03d9211"
    }
}
```

[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 返回用户信息 | 提问成功
00001 | 系统错误 | 空| 提问失败
00002 | 参数格式不正确 |空| 提问失败
20000 | 该用户未注册，无法找到！ | 空|提问失败
20002 | 未找到对应的图片|空|提问失败
40000 | 数据库连接失败|空|提问失败

### 删除提问接口（POST）
/delete/question    
[入参示例]
```
{
	"question_id":"5a8198dadb21344ce0dbbbce"
}
```
[入参说明]  

question_id|
|-------|
问题的唯一id|

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": "no result"
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 无| 删除成功
00001 | 系统错误 | 空| 删除失败
00002 | 参数格式不正确 |空| 删除失败
20001 | 问题_id号不存在，请检查！ | 空|删除失败
40000 | 数据库连接失败|空|删除失败

### 问题回答接口（POST）
/add/answer     

[入参示例]
回答时以表单形式提交
```
"user_id":"5a86c7fb9bca952c109b9673"
"question_id":"5a86c8859bca952c109b9675"
"content":"自己百度呗。。。"
"img":
```
[入参说明]

user_id | question_id   |content | img
------- | -------|--------------- | -------
回答用户的唯一id | 问题的唯一id | 回答内容|提问说明用一张或多张图片（可为空）
[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": {
        "user_id": "5a86c7fb9bca952c109b9673",
        "content": "自己百度呗。。。",
        "question_id": "5a86c8859bca952c109b9675",
        "img": ["/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYn"],
        "create_time": "2018-02-22 11:40",
        "_id": "5a8e3ba048969f48a03d9214"
    }
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 无| 回答成功
00001 | 系统错误 | 空| 回答失败
00002 | 参数格式不正确 |空| 回答失败
20000 | 该用户未注册，无法找到！ | 空|回答失败
20001 | 问题_id号不存在，请检查！|空|回答失败
20002 | 未找到对应的图片|空|回答失败
40000 | 数据库连接失败|空|回答失败

### 删除回答接口（POST）
/delete/answer    
[入参示例]
```
{
	"answer_id":"5a819c1c4ad2b642d02898d6"
}
```
[入参说明]  

|answer_id|
|-------|
|回答的唯一id|   

[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": "no result"
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 无| 删除成功
00001 | 系统错误 | 空| 删除失败
00002 | 参数格式不正确 |空| 删除失败
30000 | 回答_id号不存在，请检查！ | 空|删除失败
40000 | 数据库连接失败|空|删除失败

### 查询接口（POST）
/find   
[入参示例]
```
{
	"collection":"answers",
	"queryJson":{
		"question_id":"5a7da1eacd48643ff4a1b859"
	}
}
```
[入参说明]

collection | queryJson |
|-------|-------|
| 查询集合名称 | 查询json |

[collection选择]  

|collection|说明|包含字段|
|-----|-----|------|
| logInfo | 用户登录注册及个人信息存放集合 | "_id":唯一标识（为24位16进制数）,"user":用户名,"password":密码,"rank":用户级别（非管理员无修改权限）,"age":年年龄,"avatar":头像图片,"motto":用户签名
| questions | 所有提问存放集合 | "_id":唯一标识（为24位16进制数）, "user_id" : 关联的提问用户_id, "content" : 问题内容,"img" : 提问说明图片数组,"create_time" : 问题创建时间（后台创建，前台需要获取即可，无需传递该参数值）
| answers | 所有回答存放集合 | "_id":唯一标识（为24位16进制数）, "user_id" : 关联的回答用户_id, "content" : 回答内容,"img" : 回答说明图片数组,"create_time" : 问题创建时间（后台创建，前台需要获取即可，无需传递该参数值）,"question_id":关联问题_id

注：字段中的内容可任意组合放入"queryJson"中，用于查询！
[出参示例]
```
{
    "code": "0",
    "msg": "success",
    "result": 
}
```
[出参说明]

code | msg  | result | 说明
------- | ------- | -------|----|
0 | sucess | 返回查询内容|查询成功
00001 | 系统错误 | 空| 查询失败
00002 | 参数格式不正确 |空| 查询失败
40000 | 数据库连接失败|空|查询失败