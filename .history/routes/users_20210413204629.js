var express = require('express');
var router = express.Router();
var query = require('../db/index')
const {PWD_SALT,PRIVATE_KEY,EXPIRESD} = require('../utils/constant')
const {md5} = require('../utils/index')
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 注册接口
 */
router.post('/register', async function(request, response, next) {
  let user = request.body
  try {
    let dbUser = await query('select * from user where username=?', user.username)
    // 数据库有该用户名，注册失败
    if (dbUser.length > 0) {
      responseText = {code: 201, msg: '该用户名已存在'}
      response.send(responseText)
    }
    // 注册成功
    user.password = md5(user.password + PWD_SALT)
    await query('insert into user(username,password,nickname) values(?,?,?)', [user.username, user.password, '小五'])
    responseText = {code: 200, msg: '注册成功'}
    response.send(responseText)
  } catch (error) {
    console.log(error)
    next(error)
  }
});
/**
 * 登陆接口
 */
router.post('/login', async function(request, response, next) {
  let user = request.body
  user.password = md5(user.password + PWD_SALT)
  try {
    let dbUser = await query('select * from user where username=? && password=?', [user.username, user.password])
    // 登陆失败
    if (dbUser.length === 0) {
      responseText = {code: 202, msg: '用户名或密码错误'}
      response.send(responseText)
    }
    // 登陆成功
    let username = user.username
    let token = jwt.sign(user.username, PRIVATE_KEY, {expiresIn:EXPIRESD})
    responseText = {code: 200, msg: '登陆成功', token:token}
    response.send(responseText)
  } catch (error) {
    console.log(error)
    next(error)
  }
});

module.exports = router;
