var mongoose = require('../config/db-config');

//创建骨架
var cateSchema = new mongoose.Schema({
	cateName : {
		type:String,
		unique:true
	}
});

var cateModel = mongoose.model('catalogue',cateSchema);

module.exports = cateModel;