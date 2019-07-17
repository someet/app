var WxParse = require('../wxParse/wxParse.js');
var req = require('../../common/request.js');
var user = require('../../common/user.js');
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
	
  data: {
		id:0,
		model:{},
		is_click:false,
		isShow:true,
		t:util.formatTime(1560417955)
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
			console.log(detail)
			WxParse.wxParse('content', 'html', detail.details, that,0);
			WxParse.wxParse('review', 'html', detail.review, that,0);
			WxParse.wxParse('field2', 'html', detail.field2, that,0);
			WxParse.wxParse('field6', 'html', detail.field6, that,0);
			that.setData({
				model:detail,
				isShow:false,
				t:util.formatTime(detail.start_time)
			}),
			console.log(this.model)
			wx.hideLoading()
		}).catch(req.showErr)
  	},
  	//点击报名
  	goAnswer:function(){
  		var that = this;
  		if(this.data.model.is_answer) return false;
  		this.is_click = true;
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
  		var that = this;
  		wx.showLoading({
		  title: '查询报名状态中',
		})
  		var data = {'id':this.data.id};
  		req.checkAnswer(data).then((res)=>{
  			wx.hideLoading();
  			var title = '可以报名';
  			if(res.success == 0) title = '服务器错误';
  			if(res.data.status !== 1){
				if(res.data == 'is_not_complete'){
					title = '请先完善个人信息';
					app.showMsg(title);
					//跳转到修改个人信息页面
					
					
					
					return false;
				}
  				if(res.data == 'is_empty'){title = '活动查询失败';}
  				if(res.data == 'is_full'){title = '报名人数已满';}
  				if(res.data == 'is_conflict'){title = '报名活动冲突';}
  				if(res.data == 'not_release'){title = '活动尚未发布';}
  				if(res.data == 'is_answer'){title = '活动已报名';}
  				wx.showToast({
				  title: title,
				  icon: 'none',
				  duration: 2000
				})
				that.is_click = false;
  			}else{
  				//开始报名
  				that.startAnswer(res.data.is_set_question)
  			}
  		}).catch(req.showErr)
  	},
  	startAnswer(is_set_question){
  		// 开始报名流程
  		var data = {'id':this.data.id};
		if(is_set_question){
			//跳转到回答问题页面
			wx.navigateTo({
			  url: '../question/index?id='+this.data.id
			})
			return false
		}
  		req.startAnswer(data).then((res)=>{
  			console.log(res)
  			if(res.success == 0){
  				wx.showToast({
				  title: '服务器错误',
				  icon: 'none',
				  duration: 2000
				})
				that.is_click = false;
  			}else{
  				if(res.status == 1){
	  				if(typeof(res.is_set_question) != undefined && res.is_set_question == 1){
	  					//跳转回答问题页面
	  					wx.navigateTo({
						  url: '../question/index'
						})
	  				}else{
	  					//未设置问题则直接生成报名记录
	  					console.log(res)
	  					that.is_click = false;
	  				}
	  			}
  			}
  		});
  	}
})