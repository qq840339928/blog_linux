var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

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
    res.send({code:200,msg:'发表成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
})


//评论列表接口
router.get('/list',async(req,res,next) => {
    let {id} = req.query
    try {
      let sql = 'select * from comment where blog_id = ?'
      let result = await querySql(sql,[id])
      let finallyResult = await test1(result)
      console.log(finallyResult)
      res.send({code:200,msg:'成功',data:finallyResult})
    }catch(e){
      console.log(e)
      next(e)
    } 
})
async function test1 (result) {
  let finallyResult = []
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    let e = await test2(element)
    console.log(e, 2)
    finallyResult.push(e)
  }
}
async function test2 (element) {
  // 查找这个用户的昵称和头像
  let res = await querySql('select nickname,headportrait from user where id = ?',[element.user_id])
  element.nickname = res[0].nickname
  element.headportrait = res[0].headportrait
  console.log(element, 1)
  return element
}


module.exports = router;
