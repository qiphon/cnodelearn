var mongoose = require('../config/db-config');

var topicSchema = new mongoose.Schema({
	tName: String,
	tContent:String,
	cid:{
		type:'ObjectId',
		ref:'catalogue'
	},
	user:{
		//当前id就是发布者id
		type:"ObjectId",

		//ref表示关联
		ref:'bbs_user'
	},
	createTime:{
		type:Date,
		default:Date.now
	},
	lastEdit:{
		type:Date
	},
	visitNum:{
		type:Number,
		default:0
	},
	rid:[{
		type:'ObjectId',
		ref:'bbs_reply'
	}]
});

var topicModel = mongoose.model('bbs_topic',topicSchema);

module.exports = topicModel;