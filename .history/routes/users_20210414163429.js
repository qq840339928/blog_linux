var express = require('express');
var router = express.Router();
var query = require('../db/index')
const {PWD_SALT,PRIVATE_KEY,EXPIRESD} = require('../utils/constant')
const {md5, upload} = require('../utils/index')
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
  console.log(user)
  try {
    let dbUser = await query('select * from user where username=?', [user.username])
    // 数据库有该用户名，注册失败
    if (dbUser.length > 0) {
      responseText = {code: 201, msg: '该用户名已存在'}
      response.send(responseText)
      return
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
    let dbUser = await query('select * from user where username = ? and password = ?', [user.username, user.password])
    // 登陆失败
    if (dbUser.length === 0) {
      responseText = {code: 202, msg: '用户名或密码错误'}
      response.send(responseText)
      return
    }
    // 登陆成功
    let username = user.username
    let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn:EXPIRESD})
    responseText = {code: 200, msg: '登陆成功', token:token, data:{nickname: dbUser[0].nickname || '张三', headportrait: dbUser[0].headportrait, id: dbUser[0].id}}
    // 把token写入客户端的cookie中
    response.send(responseText)
  } catch (error) {
    console.log(error)
    // next(error)
  }
});
//获取用户信息接口
router.get('/info',async(req,res,next) => {
  let {username} = req.user
  try {
    let userinfo = await querySql('select nickname,headportrait from user where username = ?',[username])
    res.send({code:0,msg:'成功',data:userinfo[0]})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

//头像上传接口
router.post('/upload',upload.single('head_img'),async(req,res,next) => {
  console.log(req.file)
  let imgPath = req.file.path.split('public')[1]
  let imgUrl = 'http://127.0.0.1:3000'+imgPath
  res.send({code:200,msg:'上传成功',msg:imgUrl})
})

//用户信息更新接口
router.post('/updateUser',async(req,res,next) => {
  let {nickname,head_img} = req.body
  console.log(req)
  try {
    let result = await querySql('update user set nickname = ?,head_img = ? where username = ?',[nickname,head_img,username])
    console.log(result)
    res.send({code:0,msg:'更新成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

module.exports = router;
