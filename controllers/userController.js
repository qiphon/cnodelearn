var userModel = require('../models/userModel');
var crypto = require('crypto');

var transporter = require('../models/nodemail');

//头像上传模块
var upload = require('../config/upload_config');

//加载头像处理模块
var gm = require('gm');
//定义user
var user = {};

user.reg = function(req,res){
	// res.send('register');
	res.render('home/reg');
};

user.doReg = function(req,res){
	var uname = req.body.uname.trim();
	var upwd = req.body.upwd.trim();
	var reupwd = req.body.reupwd.trim();
	var email = req.body.email.trim();
	console.log(req.body)
	if(upwd!=reupwd){
		req.flash('errMsg','两次密码不一致');
		// console.log(11111111111111111111111)
		res.redirect('/users/reg');
		return;
	}
	var con = {
		uname:uname
	}
	userModel.findOne(con,function(err,data){
		// console.log(data)
		if(err){
			console.log(err);
			return;
		};
		if(data){
			req.flash('errMsg','用户名已存在');

			res.redirect('/users/reg');

			return;
		}else{
			var md5 = crypto.createHash('md5');
			md5.update(upwd);
			var str = md5.digest('hex');
			// console.log(111)
			var userData = {
				uname:uname,
				email:email,
				upwd:str,
				regip:req.ip,
				lastLogin:new Date(),
				gold:20
			}
			// console.log(userData)
			userModel.create(userData,function(err){
				if(err){
					req.flash('errMsg','数据异常，请重新尝试');
					res.redirect('/users/reg');
					return;
				}else{
					res.redirect('/');
				}
			})
		}

	})
};


user.login= function(req,res){
	res.render('home/login');
};

user.doLogin = function(req,res){
	var upwd = req.body.upwd.trim();
	var md5 = crypto.createHash('md5');
	md5.update(upwd);
	var str = md5.digest('hex');

	var con = {
		uname:req.body.uname.trim(),
		upwd:str
	};
	// console.log(con)
	userModel.findOne(con,function(err,data){
		if(!data){
			req.flash('errMsg','账户或密码有误');
			res.redirect('back');
			return;
		}
		if(data.isAllow==0){
			req.flash('errMsg','账户被冻结，请联系管理员');
			res.redirect('back');
			return;
		}
		var cha = new Date() - data.lastLogin;
		var goldPlus;
		if(Math.floor(cha/1000/60/60/24)){
			goldPlus=data.gold+20;
		}else{
			goldPlus=data.gold;
		}
		// console.log(goldPlus)

		var userdate = {
			lastLogin:new Date(),
			gold:goldPlus
		};
		// console.log(con)
		// console.log(userdate.lastLogin.toLocaleString())
		userModel.update(con,{$set:userdate},function(err,data){
			// console.log(err)
			// console.log(data)
		});
		userModel.findOne(con,function(err,data){
			req.session.user = data;
			res.redirect('/');
		// console.log(date.lastLogin)
		})
	})
}

//退出
user.logout = function(req,res){
	req.session.user = null;
	res.redirect('/');
};

user.ucenter= function(req,res){
	res.render('home/ucenter')
}

user.change_pwd = function(req,res){
	// console.log(req.session.user.upwd);
	var id ={
		_id:req.session.user._id
	}
	var md5 = crypto.createHash('md5');
	// var opwd = req.body.old_pass;
	md5.update(req.body.old_pass);
	var str = md5.digest('hex');
	var old = {
		upwd:str.trim()
	};
	console.log(id)
	if(str!=req.session.user.upwd){
		// res.send('2222222');
		req.flash('errPwd','密码有误，请重试！');
		res.redirect('/users/ucenter#change_pwd');
		return;
	}else{
		
		var new1 = req.body.new_pass;
		var new2 = req.body.new_pass2;
		// console.log(new1)
		// console.log('1111111111111111111')
		// console.log(new2)
		if(new1!=new2){
			req.flash('errPwd','两次密码不一致');
			res.redirect('/users/ucenter#change_pwd');
			return;
		}else{
			var md5 = crypto.createHash('md5');
			md5.update(new1);
			var str = {
				upwd:md5.digest('hex')
			};
			userModel.update(id,{$set:str},function(err){
				console.log(err);
			});
			req.session.user = null;
			res.redirect('/users/login');
		}
	}
}

//更改信息
user.change_des = function(req,res){
	// res.send('33')
	
	var id = {
		_id:req.session.user._id
	}
	upload(req,res,function(err){
		// 如果code的值是 LIMIT_FILE_SIZE 说明文件太大了
		// 如果code的值是 fileType，说明文件类型不符合
		if(err){
			switch(err.code){
				case 'LIMIT_FILE_SIZE':
					var errMsg = '文件过大……';
				break;
				case 'fileType':
					var errMsg = "文件类型不支持";
				break;
			}
			//返回对应的错误信息 -- 跳转会上传文件的页面 -- 一次性
			//模块 connect-flash
			req.flash('errMsg',errMsg);
			return res.redirect('back');
		}
		// console.log(req.file)
		if(req.file){
			var filename = req.file.filename;
			// console.log(filename)
			// 缩放图片 -- 文件上传完毕存储的位置req.file.path
			gm(req.file.path).resize(48,48).write(req.file.path,function(err,msg){
				// console.log(err)
				// console.log(msg)
			});

			var con = {
				uportrait:filename,
				des:req.body.des
			};
			userModel.update(id,{$set:con},function(err){
				if(err){
					req.flash('errMsg','网络异常，请重试！');
					res.redirect('back');
				}else{
					userModel.findOne(con,function(err,data){
						req.session.user = data;
						// console.log(req.session.user)
						res.redirect('/users/ucenter');
					})
				}
			});
		}else{
			var con = {
				des:req.body.des
			};
			userModel.update(id,{$set:con},function(err){
				if(err){
					req.flash('errMsg','网络异常，请重试！');
					res.redirect('back');
				}else{
					userModel.findOne(con,function(err,data){
						req.session.user = data;
						// console.log(req.session.user)
						res.redirect('/users/ucenter');
					})
				}
			});
		}
	})
	// console.log(111)
	
}

user.search_pass = function(req,res){
	res.render('home/search_pass');
}

user.newPass = function(req,res){
	// console.log(req.body);
	// res.send('111111111111111')
	var con = {
		uname : req.body.uname,
		email : req.body.email
	}

	userModel.findOne(con,function(err,data){
		if(err){
			return console.log(err);
		}
		if(data){
			// console.log('11111111111111111111111111111')
			var mail = {
				from : 'qiphon <num113@163.com>',
				//主题
				subject: data.uname+'你好',

				//收件人
				to: data.email,
				//邮件内柔 ，html格式
				html: '您好！您正在使用邮箱更新信息<a href="http://127.0.0.1/users/renewPass?uname="+data.uname+"">点此找回</a>'
			};
			transporter.sendMail(mail,function(err,info){
				if(err){
					return console.log(err);
				}
				console.log('mail sent:',info.response);
				req.flash('errMsg','请登录邮箱完成之后操作');
				res.redirect('back');
			});
		}
	})

}

user.renewPass= function(req,res){
	// res.send("66666666666");
	res.render('home/renewPwd');
}

user.passback = function(req,res){
	// res.send('111111111111')
	var upwd = req.body.upwd.trim();
	var reupwd = req.body.reupwd.trim();
	if(upwd!=reupwd){
		req.flash('errMsg','两次密码不一致');
		res.redirect('back');
	}else{

		var con = {
			// uname : req.body.uname.trim(),
			upwd : req.body.upwd.trim()
		}
		// console.log(req.session)
		// console.log(con);
		res.redirect('/users/login');
	}
}

module.exports=user;