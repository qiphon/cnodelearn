module.exports.isLogin = function(req,res,next){
	// 检测用户是否登录
	if(!req.session.user){
		res.redirect('/users/login');

		// 终止程序
		return;
	}


	// 移交下一个
	next();
}