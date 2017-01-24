var nodemailer = require('nodemailer');

var config = {
	host:'smtp.163.com',
	port:25,
	auth:{
		user:'num113@163.com',
		pass:'f767521025'
	}
};


//smtp客户端对象
var transporter = nodemailer.createTransport(config);

//创建邮件对象

/*var mail = {
	from : 'qiphon <num113@163.com>',
	//主题
	subject: 'test',

	//收件人
	to: 'num113@163.com',
	//邮件内柔 ，html格式
	text:'这是一个html格式的测试文件'
};*/

// transporter.sendMail(mail,function(err,info){
// 	if(err){
// 		return console.log(err);
// 	}
// 	console.log('mail sent:',info.response);
// })

module.exports = transporter;