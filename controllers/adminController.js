
//话题模块
var topicModel = require('../models/topicModel');

// 加载eventProxy
var eventproxy = require('eventproxy');
var ep = new eventproxy();
//分类模块
var cateModel = require('../models/cateModel');
//加密模块
var crypto = require('../config/crypto_config');
//头像上传模块
var upload = require('../config/upload_config');

//加载头像处理模块
var gm = require('gm');

var userModel = require('../models/userModel');

var admin= {};
admin.index = function(req,res){
	res.render('admin/index');
	// res.send('111111111sdf1')
}

admin.userShow = function(req,res){
	// console.log('4444444444444444')
	userModel.find().count(function(err,total){
		var pageSize =8;

		// 定义当前的页数
		var page = req.query.page?req.query.page:1;

		// 页数的最大值
		var pageMax = Math.ceil(total/pageSize);

		// 得到偏移量
		var pageOffset = (page-1)*pageSize;
		// 查询所有的用户
		userModel.find().sort({createTime:-1}).skip(pageOffset).limit(pageSize).exec(function(err,userData){
			// console.log(userData);
			// 查询所有的用户数据
			var data = {
				userData:userData,
				page : page,
				pageMax : pageMax
			}
			res.render('admin/user/userShow',data);
			// console.log('dddddddddddd')
			// console.log(data);
		})

	})
}

admin.userEdit = function(req,res){
	var con = {
		_id : req.query._id
	};
	userModel.find(con,function(err,user){
		// console.log(user)
		var msg = user[0];
		res.render('admin/user/userEdit',{user:msg})
	})
}

admin.userUpdate = function(req,res){
	// 判断是否上传了头像
	upload(req,res,function(err){
		// console.log(req.body)
		// 更新条件
		var con = {
			_id : req.body._id
		};
		// console.log(con)
			// 如果code的值是 LIMIT_FILE_SIZE 说明文件太大了
			// 如果code的值是 fileType，说明文件类型不符合
			// 使用switch结构对应错误信息
		if(err){
			switch(err.code){
				case 'LIMIT_FILE_SIZE':
					var errMsg = '文件太大了,受不了....'
				break;
				case 'fileType':
					var errMsg = '八字不合呀....';
				break;
			}	

				// 返回对应的错误信息 -- 跳转会上传文件的页面 -- 一次性
				// 模块 connect-flash
				req.flash('errMsg',errMsg)
				res.redirect('back');
			}else{
				console.log(req.file)
				if(req.file){

				// 缩放图片 -- 文件上传完毕存储的位置req.file.path
				gm(req.file.path).resize(48,48).write(req.file.path,function(err,msg){
					console.log(err);
					console.log(msg);
				})
				
				// 接收数据
				var reNew = {
					gold : req.body.gold,
					des : req.body.des,
					email:req.body.email,
					uportrait:req.file.filename
				}
				// 更新
				userModel.update(con,{$set:reNew},function(err){
					if(err){
						// 说明有错误
						req.flash('errMsg','数据异常，请重新尝试....');

						// 跳转
						res.redirect('back');
					}else{
						// 说明有错误
						req.flash('errMsg','更新成功...');

						// 跳转
						res.redirect('back');
					}

				})
			
		}else{
			// 接收数据
			var reNew = {
					gold : req.body.gold,
					des : req.body.des,
					email:req.body.email
				}
			
			// 更新
			userModel.update(con,{$set:reNew},function(err){
				if(err){
					// 说明有错误
					req.flash('errMsg','数据异常，请重新尝试....');

					// 跳转
					res.redirect('back');
				}else{
					// 说明有错误
					req.flash('errMsg','更新成功...');

					// 跳转
					res.redirect('back');
				}

			})
		}
		}			
	})
}
	
admin.userStart = function(req,res){
	var con = {
		_id : req.query._id
	}
	// 更新数据
	var newData = {$set:{isAllow:0}};

	// 更新
	userModel.update(con,newData,function(err){
		res.redirect('back')
	});
}

admin.userStop = function(req,res){
	var con = {
		_id : req.query._id
	}
	// 更新数据
	var newData = {$set:{isAllow:1}};

	// 更新
	userModel.update(con,newData,function(err,data){
		console.log(data);
		res.redirect('back')
	})
}
//添加用户
admin.userAdd = function(req,res){
	res.render('admin/user/userAdd');
}

admin.userDoAdd = function(req,res){
	var upwd = req.body.upwd.trim();
	var reupwd = req.body.reupwd.trim();
	if(upwd!=reupwd){
		req.flash('errMsg','两次输入的密码不一致......');
		// 跳转
		res.redirect('back');
		// 终止程序执行
		return;
	};
	var con = {
		uname:req.body.uname.trim()
	};
	userModel.findOne(con,function(err,data){

		if(err){
			// 直接终止
			// console.log(err);
			return;
		};

		// data不存在可以注册，存在不能注册
		if(data){

			// 返回错误信息
			req.flash('errMsg','用户名已存在......');
			// 跳回
			res.redirect('back');
			// 终止程序
			return;
		}else{
			// 用户的数据
			var arr = {
				uname : req.body.uname.trim(),
				age:req.body.age.trim(),
				sex: req.body.sex.trim(),
				upwd : crypto(upwd),
				regip : req.ip,
				email:req.body.email.trim(),
				lastLogin : Date.now(),
				gold : 20
			}
		userModel.create(arr,function(err,data){
				// console.log(data);
				if(err){
					// 说明有错误
					req.flash('errMsg','数据异常，请重新尝试....');

					// 跳转
					res.redirect('back');

					// 终止
					return;

				}else{
					// 成功了
					// 跳转
					res.redirect('/admin/userShow');
				}
				

			});

		}
		
	});
};


//分类
admin.catalogue = function(req,res){
	cateModel.find({}).exec(function(err,cateData){
		console.log(cateData);
		res.render('admin/topic/cateTopics',{cateData:cateData});
	});
}
//修改
admin.cateEdit = function(req,res){
	var con = {
		_id : req.query._id
	};
	cateModel.find(con).exec(function(err,cateData){
		// console.log(cateData);
		res.render('admin/topic/cateEdit',{cateData:cateData});	
	})
}
//更改
admin.cateUpdate = function(req,res){
	var con = {
		_id : req.body._id
	};
	// console.log(con);
	var data = req.body;
	// console.log(data);
	cateModel.update(con,{$set:data},function(err){
		if(err){
			console.log(null);
			return;
		};
		res.redirect('/admin/cateTopics');

	});
}

//添加
admin.cateDoAdd = function(req,res){
	var data = req.body;
	console.log(data);
	cateModel.create(data,function(err){
		if(err){
			console.log(err);
			res.redirect('back');
		};
		res.redirect('/admin/cateTopics');

	});
}
//删除（待改善）
admin.cateDel = function(req,res){
	var con = {
		_id : req.query._id
	};
	cateModel.remove(con,function(err){
		if(err){
			console.log(null);
			return;
		};

		res.redirect('back');

	});
}

// 话题查看
admin.topicsShow = function(req,res){
	// 将分类模块的信息分配给前台页面 --- 针对分类的模型
	// 默认将所有的话题查询出来 -- 分页

	// 设置监听 
	ep.all('topicsData','page','pageMax',function(topicsData,page,pageMax){
		
		// 分配数据
		var data = {
			topicsData:topicsData,
			page:page,
			pageMax:pageMax
		}
		// console.log(data)
		// 响应数据
		res.render('admin/topic/topicsShow',data);
	});


	// 按照分类进行查询
	var con = {};

	/*
		分页处理
	*/ 
	//  每页显示的条数
	var pageSize = 10;

	// 当前的页数
	var page = req.query.page?req.query.page:1;
	
	topicModel.find(con).sort({createTime:-1}).populate('cid','cateName').populate('user','uname').populate('rid').count(function(err,total){

		// 获取总条数 total
		
		// page的限制
		if(page<=1){
			page=1
		}

		// 最大的页数
		var pageMax = Math.ceil(total/pageSize);
		// console.log(pageMax)
		if(page>=pageMax){
			page=pageMax
		}

		// 当前的偏移量
		var pageOffset = (page-1)*pageSize;

		// 进行查询
		// 关联查询
		topicModel.find(con).sort({createTime:-1}).skip(pageOffset).limit(pageSize).populate('user').populate('cid','cateName').populate('rid').exec(function(err,topicsData){

			ep.emit('topicsData',topicsData);
			ep.emit('page',page);
			ep.emit('pageMax',pageMax);
			
		});

	})
};

module.exports = admin;