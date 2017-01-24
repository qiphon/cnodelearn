// 对应的是bbs_users集合

// 加载数据库配置文件
var mongoose = require('../config/db-config');

// 创建骨架
var userSchema = new mongoose.Schema({
	// 用户名
	uname : {
		type : String,
		unique : true
	},
	level:{
		type:Number,
		default:0
	},
	upwd : {
		type : String
	},
	uportrait:{
		type:String,
		default:''
	},
	age : {
		type : Number,
		default : 1
	},
	sex : {
		type : Number,
		default : 3
	},
	email : {
		type : String

		// 绑定邮箱 --- 邮箱是唯一的
	},
	//是否允许登录
	isAllow:{
		type:Number,
		default:1
	},
	// 积分
	gold : {
		type : Number
	},

	// 个性签名
	des : {
		type : String,
		default : ''
	},

	// 创建账户时间
	createTime : {
		type : Date,
		default : Date.now
	},
	lastLogin : {
		type : Date
	},
	regip : {
		type : String
	}
});

// 生成对应集合的模型
var userModel = mongoose.model('bbs_user',userSchema);

// 向外暴露
module.exports = userModel;