// 数据库配置文件

// 引入mongoose模块
var mongoose = require('mongoose');

// 定义数据库地址
var dbUrl = '127.0.0.1';

// 定义端口号
var dbPort = '27017';

// 定义数据库名称
var dbName = 'cnode';

// 定义连接的账户
var dbUser = 'qiphon';

// 定义账户密码
var dbPwd = '767521025';

// 需要的链接数据库的地址 // mongodb://username:password@hostname:port/database
var connect_url = 'mongodb://'+dbUrl+':'+dbPort+'/'+dbName;

// 连接
mongoose.Promise = global.Promise; 
mongoose.connect(connect_url,function(err){
	if(!err){
		console.log('连接成功');
	}
});


// 将mongoose对象向外暴露
module.exports = mongoose;
