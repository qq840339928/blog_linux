1.使用express脚手架 express-generator
2.写一个接口
3.配置跨域cnpm install cors --save，app.js中引入调用 
    var cors = require('cors')   app.use(cors())
4.安装mysql模块，连接mysql
5.把第一个接口弄通
6.密码加密crypto    cnpm install crypto --save
7.服务端生成token，用户登陆后返回给客户端