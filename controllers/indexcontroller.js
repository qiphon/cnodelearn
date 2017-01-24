var cateModel = require('../models/cateModel');
var topicModel = require('../models/topicModel');
var userModel = require('../models/userModel');
//加载eventproxy
var eventproxy = require('eventproxy');
var ep = new eventproxy();

var index = {};

index.index = function(req,res){

	//设置监听
	ep.all('topicData','cateData','page','pageMax','tab',function(topicData,cateData,page,pageMax,tab){
		//关联查询 -- 以设置user（存储的是用户的id）
		//响应数据
		// console.log("000000000000000000000000")
		// console.log(cateData)
		// console.log(topicData)
		var data = {
			cateData:cateData,
			topicData:topicData,
			page:page,
			pageMax:pageMax,
			tab:tab
		}
		res.render('home/index',data);
	});

	//查询话题
	//1.同时需要查询出发表的用户
	//2.在首页显示的时候，我们只是需要获取话题的标题、浏览量、用户的头像（没有，使用用户名代替）
	//关联查询
	
	//分类
	var con= {};
	if(req.query.tab=='all'|| !req.query.tab){
		ep.emit('tab','all');	
	}else{
		con.cid=req.query.tab;
		ep.emit('tab',con.cid);	
	}
	
		// console.log(1111111111111111111111111111)
		// console.log(con)
	//分页
	
	var pageSize = 30;
	//当前页数
	// console.log(req.query.page);
	// console.log('1111111111111111')
	var page = req.query.page?req.query.page:1;
	// console.log(page)
	topicModel.find(con).populate('user').populate('cid','cateName').count().exec(function(err,total){

		if(page<=1){
			page= 1;
		};
		// console.log(total)
		var pageMax = Math.ceil(total/pageSize);
		// console.log(pageMax)
		// console.log('99999999999999999')
		if(page>=pageMax){page= pageMax};

		var pageOffset = (page-1)*pageSize;

		topicModel.find(con).populate('user','uname uportrait').skip(pageOffset).limit(pageSize).sort({createTime:-1}).populate('cid','cateName').exec(function(err,topicData){
			
			ep.emit('pageMax',pageMax);
			ep.emit('page',page);
			ep.emit('topicData',topicData);
		});
		//查询分类
		cateModel.find(function(err,cateData){
			// console.log(data);
			// res.render('home/index',{cateData,cateData});
			ep.emit('cateData',cateData);
		});
	});
};




module.exports = index;