var express = require('express');
var router = express.Router();
var query = require('../db/index')
const {PWD_SALT} = require('../utils/constant')
const {md5} = require('../utils/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 注册接口
 */
router.post('/register', function(request, response, next) {
  let user = request.body
  try {
    let dbUser = await query('select * from user where username=?', user.username)
    if () {

    }
  } catch (error) {
    
  }
});

module.exports = router;
