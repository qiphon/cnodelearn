var express = require('express');
var router = express.Router();

var topic = require('../controllers/topiccontroller');
var userCheck = require('../middlewares/userCheck');


/* GET home page. */
router.get('/create',userCheck.isLogin,topic.create);

router.post('/create',userCheck.isLogin,topic.doCreate);

// router.get('/:id',function(req,res){
// 	res.sender(200,2)
// });
router.get('/:id',topic.details);

// 回复话题 --- 回复集合(评论集合)
router.post('/reply/:id',userCheck.isLogin,topic.reply);

// 给回复点赞
router.get('/reply/like/:id',topic.replyLike);

module.exports = router;
