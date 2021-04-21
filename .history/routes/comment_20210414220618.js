var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
var userMethods = require('./users')

//发表评论接口
router.post('/publish',async(req,res,next) => {
  let {content,id} = req.body
  let {username} = req.user
  try {
    let userSql = 'select * from user where username = ?'
    let user = await querySql(userSql,[username])
    let {id:user_id,head_img,nickname} = user[0]
    let sql = 'insert into comment(user_id,blog_id,content,createTime) values(?,?,?,NOW())'
    let result = await querySql(sql,[user_id,id,content,nickname,head_img])
    res.send({code:0,msg:'发表成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
})


//评论列表接口
router.get('/list',async(req,res,next) => {
    let {id} = req.query
    try {
      let sql = 'select * from comment where id = ?'
      let result = await querySql(sql,[id])
      // 查找这个用户的昵称和头像

      res.send({code:0,msg:'成功',data:result})
    }catch(e){
      console.log(e)
      next(e)
    } 
})


module.exports = router;
