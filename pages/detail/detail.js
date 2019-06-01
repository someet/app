var WxParse = require('../wxParse/wxParse.js');
var req = require('../../common/request.js');
var user = require('../../common/user.js');
Page({
  data: {
	id:0,
	model:{}
  },
  	onLoad: function (options) {
		var act_id = options.id
		this.setData({
			id:act_id
		})
		this.getDetail();
  	},
  	onReady:function(){
	 	req.getHeader();
	 	var userInfo = user.getUserInfo()
  	},
  	getDetail:function(){
		wx.showLoading({
		  title: '加载中',
		})
		var that = this;
		var data = {'id':this.data.id};
		req.getView(data).then((res)=>{
			 	var detail = res.data;
			WxParse.wxParse('content', 'html', detail.details, that,0);
			WxParse.wxParse('review', 'html', detail.review, that,0);
			WxParse.wxParse('field2', 'html', detail.field2, that,0);
			WxParse.wxParse('field6', 'html', detail.field6, that,0);
			that.setData({
				model:detail
			}),
			wx.hideLoading()
		}).catch(req.showErr)
  	},
  	//点击报名
  	goAnswer:function(){
  		console.log('You click the btn')
  		//检查自身的状态，是否填写了手机号，微信号
  		//检查活动状态
  		var title;
  		if(this.data.model.status == 20){
  			this.checkAnswer();
  		}else{
  			if(this.data.model.status == 30){
	  			title = '活动已关闭';
	  		}
	  		if(this.data.model.status == 40){
	  			title = '活动已取消';
	  		}
	  		wx.showToast({
			  title: title,
			  icon: 'none',
			  duration: 2000
			})
  		}
  	},
  	goback(){
  		console.log('goback')
  	},
  	//判断活动状态
  	checkAnswer(){
  		wx.showLoading({
		  title: '查询报名状态中',
		})
  		var data = {'id':this.data.id};
  		req.checkAnswer(data).then((res)=>{
  			console.log(res)
  			if(res){
  				wx.showToast({
				  title: '当前状态无法报名',
				  icon: 'none',
				  duration: 2000
				})
  			}
  			wx.hideLoading()
  		})
  		// 开始报名流程
  		req.startAnswer().then((res)=>{
  			if(res.status == 1){
  				if(typeof(res.is_set_question) != undefined && res.is_set_question == 1){
  					//跳转回答问题页面
  					wx.navigateTo({
					  url: 'page/question/index'
					})
  				}else{
  					//未设置问题则直接生成报名记录
  					console.log(res)
  				}
  			}
  		});
  	}
})