var express = require('express');

var router = express.Router();

var admin = require('../controllers/adminController');

router.get('/',admin.index);
/*router.get('/',function(req,res){
	res.send('dfsdfsdfsfd')
});*/
//所有用户
router.get('/userShow',admin.userShow);

//修改页面
router.get('/userEdit',admin.userEdit);
//更新
router.post('/userUpdate',admin.userUpdate);

//登录条件
router.get('/userStart',admin.userStart);

router.get('/userStop',admin.userStop);


//添加用户
router.get('/userAdd',admin.userAdd);

router.post('/userDoAdd',admin.userDoAdd);

//用户的话题分类
router.get('/cateTopics',admin.catalogue);

// 修改
router.get('/cateEdit',admin.cateEdit);
// 更改
router.post('/cateUpdate',admin.cateUpdate);
//添加
router.post('/cateDoAdd',admin.cateDoAdd);
//删除
router.get('/cateDel',admin.cateDel);

// 话题列表
router.get('/topicsShow',admin.topicsShow);

module.exports = router;