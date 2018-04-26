/**
 * Created by sc on 2018/2/12.
 */

var err = {
  //参数格式不正确
  paramError:{
      code:'00002',
      msg:'参数格式不正确！'
  },

  //登录注册时，用户/密码为空
  signError:{
      code:'10000',
      msg:'用户名或密码不可为空'
  },

  //注册，用户名已存在
  signExistError:{
      code:'10001',
      msg:'该用户名已被注册'
  },

  //警告！用户名中存在敏感词语！
  signCensorError:{
    code:'10002',
    msg:'警告！用户名中存在敏感词语！'
  },

  //请求session时，没有数据
  noSessionError:{
      code:'10003',
      msg:'没有session数据!'
  },
  notLogIn:{
      code:'10004',
      msg:'用户未登录!'
  },

  //该用户未注册，无法提问
  userNotRegisterError:{
      code:'20000',
      msg:'该用户未注册，无法找到！'
  },

  //问题_id号不存在，请检查！
  questionIdExistError:{
      code:'20001',
      msg:'问题_id号不存在，请检查！'
  },

  // 未找到对应的图片
  imageExistErro:{
      code: '20002',
      msg:",未找到对应的图片"

  },

  //回答_id号不存在，请检查！
  answerIdExistError:{
      code:'30000',
      msg:'回答_id号不存在，请检查！'
  },

  //课程已存在
  courseExistError:{
      code:'40000',
      msg:'课程名称已存在！'
  },

  //课程未找到
  coursesNotFound:{
      code:'40001',
      msg:'未找到该课程'
  },

  //数据库错误
  databaseError:{
      code:'50000',
      msg:'数据库连接失败'
  }

};

module.exports = err;