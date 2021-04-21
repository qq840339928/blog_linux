var express = require('express');
var router = express.Router();
var query = require('../db/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 注册接口
 */
router.post('/register', function(request, response, next) {
  let user = request.body
  query('select * from user where username=?', user.username).then(res => {
    // 数据库有该用户名，注册失败
    if (res.length > 0) {
      responseText = {code: 201, msg: '该用户名已存在'}
      response.send(responseText)
    } else {
      // 注册成功
      query('insert into user(username,password,nickname) values(?,?,?)', [user.username, user.password, '小五']).then(res => {
        console.log(res)
      })
    }
  })
});

module.exports = router;
