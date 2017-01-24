var express = require('express');
var router = express.Router();
var userCheck = require('../middlewares/userCheck');
/* GET users listing. */
var user = require('../controllers/userController');
router.get('/reg',user.reg);
// router.get('/',function(req,res){
// 	res.send('1234');
// })
// 
router.post('/doReg',user.doReg);

router.get('/login',user.login);

router.post('/doLogin',user.doLogin);

//退出 
router.get('/logout',user.logout);

router.get('/ucenter',userCheck.isLogin,user.ucenter);

router.post('/change_pwd',userCheck.isLogin,user.change_pwd);

router.post('/change_des',userCheck.isLogin,user.change_des);

router.get('/search_pass',user.search_pass);

router.post('/newPass',user.newPass);

router.get('/renewPass',user.renewPass);

router.post('/passback',user.passback);



module.exports = router;
