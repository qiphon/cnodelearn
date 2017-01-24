//分类模型
var cateModel = require('../models/cateModel');

//话题模型
var topicModel = require('../models/topicModel');


// 加载回复集合模型
var replyModel = require('../models/replyModel');

// 加载模型 回复点赞
var replyLikeModel = require('../models/replyLikeModel');

// 加载eventProxy
var eventproxy = require('eventproxy');
var ep = new eventproxy();

// 定义topic对象
var topic = {};
topic.create = function(req,res){
	cateModel.find(function(err,cateData){
		res.render('home/createTopic',{cateData:cateData});
	})
	
}

topic.doCreate = function(req,res){
	// console.log(req.body)
	// var editDate = new Date();

	var con = {
		tName : req.body.tName,
		tContent:req.body.tContent,
		cid:req.body.cid,
		//作者信息--- 当前登录用户的id
		user: req.session.user._id,
		lastEdit:new Date()
		
	}
	if(!req.body.cid){
		req.flash('errMsg','请选择一个板块');
		res.redirect('back');
	}else{
		// for(var i = 0;i<30;i++){ 
		topicModel.create(con,function(err,result){
			if(err){
				req.flash('errMsg','网络似乎不太给力啊，再试试吧');
	 			res.redirect('back');
			}else{
				res.redirect('/topic/'+result._id);
			}
		})
		// }
	}
}

topic.details = function(req,res){
	var con  = {
		_id : req.params.id
	};
	// console.log(con);
	// 访问量增加
	topicModel.update(con,{$inc:{visitNum:1}},function(err){
		// console.log(err);
	});
	ep.all('topicData','replyData',function(topicData,replyData){
		// console.log(topicData.user.visitNum)
		res.render('home/details',{topicData:topicData,replyData:replyData})
	});

	topicModel.findOne(con).populate('user','uname gold des uportrait').populate('cid').exec(function(err,topicData){
		// console.log(topicData)
		// res.render('home/details',{topicData:topicData});
		ep.emit('topicData',topicData);
	});
	//查询回复
	var con = {
		tid:req.params.id
	}
	replyModel.find(con).populate('user','uname uportrait').exec(function(err,replyData){
			// console.log(replyData);
			ep.emit('replyData',replyData);
	})

};

topic.reply = function(req,res){
	// 根据tid查询当前用户的回复是第几楼
	var con = {_id:req.params.id};
	topicModel.findOne(con,'rid',function(err,topicData){
		// console.log(topicData)

		var floorN = topicData.rid.length+1;
		var timeNow = new Date();
		var data = {
		tid : req.params.id,
		rContent : req.body.rContent,
		user : req.session.user._id,
		rTime:timeNow,
		floor:floorN
	};
	
	replyModel.create(data,function(err,result){
		if(err){
			// console.log(err);
		}else{
			//result对应了产生回复的id
			var con = {
				_id:req.params.id
			}
			var newData = {
				$push:{
					rid:result._id
				}
			}
			topicModel.update(con,newData,function(err){
				if(!err){
					res.redirect('back');
				}else{
					console.log(err);
				}
			})
		}

	})
})
}
topic.replyLike = function(req,res){
	//登录检查
	if(!req.session.user){
		res.send('nologin');
		return;
	}
	//接收参数
	var con = {
		//要点赞的回复的id
		_id:req.params.id,
		//点赞人的id
		likePerson:req.session.user._id

	};
	replyModel.findOne(con,function(err,data){
		// 设置响应 res.send()不能单纯的响应数字
		// res.send(200,0);	// 200是状态码，0实际返回的响应数据
		if(data){
			var newData = {
				$pull:{
					likePerson:req.session.user._id
				}
			};
			var con = {
				_id:req.params.id
			}
			replyModel.update(con,newData,function(err,result){
				if(!err){
					res.send('-');
				};
			})
		}else{
			var newData = {
				$push :{
					likePerson:req.session.user._id
				}
			};
			var con = {
				_id:req.params.id
			}
			//更新
			replyModel.update(con,newData,function(err,result){
				if(!err){
					res.send('+');
				}
			})
		}
	})
		/*
		用户单击时查询bbs_reply_like集合中是否有该数据
			有，说明已经点赞，将该文档删除
			没有有，说明还没有点赞，将添加相关的文档
	*/
}

module.exports = topic;