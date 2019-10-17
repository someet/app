var userFunc = require('../../common/user.js');
var imageUtil = require('../../utils/util.js');
var req = require('../../common/request.js');
var user = require('../../common/user.js');
var app = getApp()
Page({
  data: {
  	imagefirstsrc: 'https://img.someet.cc/WechatIMG63.jpeg',//图片链接
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高,
	isScroll:true,
	page:1,
	weekPage:1,
	answerPageCount:0,
	myAnswer:[],
	isClick:false,
	userInfo:{},
	isGetInfo:0,
	weekPageCount:0,
	weekList:[],
	isWeekScroll:true
  },
  onLoad(){
	var userInfo = wx.getStorageSync('userInfo')
	console.log(userInfo)
	var idInfo = wx.getStorageSync('session')
	if(!idInfo.unionid){
		userFunc.checkUserInfo();
	}
	if(userInfo.id){
		var data = {
			id:userInfo.id,
			username:userInfo.username,
			headimgurl:userInfo.profile.headimgurl
		}
		console.log(data)
		this.setData({
			userInfo:data
		})
		this.getMyanswers();
		this.getMyWeekAct();
	}
  },
  onGetUserInfo(e){
	var idInfo = wx.getStorageSync('session')
	if(idInfo.unionid){
		var data =e.detail.userInfo
		data.openid = idInfo.openid
		data.unionid = idInfo.unionid
		data.session_key = idInfo.session_key
		this.getUserInfo(data)
	}else{
		console.log('31231')
		userFunc.checkUserInfo();
	}
  	try {
	  // wx.setStorageSync('userInfoForSave', e.detail.userInfo)
	} catch (e) {
		
	}
	//先获取openid 再查询是否存在 不存在则创建
  },
  getUserInfo(data){
	  console.log(data)
	  var that = this;
	  if(this.data.isGetInfo){
		  app.showMsg('请稍后')
		  return false
	  }
	  this.setData({
		  isGetInfo:1
	  })
	  var checkInfo = wx.getStorageSync('userInfo')
	 req.createUser(data).then((res)=>{
		 console.log(res)
		 if(res.data.status == 1){
			 that.setData({
				 userInfo:res.data.data,
				 isGetInfo:0
			 })
			if(!checkInfo.id){
				userFunc.checkUserInfo()
			}
		 }
	 })
  },
  getMyanswers(e){
	var that = this;
	if(!this.data.isScroll){
		app.showMsg('太快了，别急')
		return false;
	}
	this.setData({
		isScroll:false
	})
	if(that.data.page >= that.data.answerPageCount && that.data.answerPageCount !=0){
		app.showMsg('没有更多数据了')
		return false
	}
	app.loadMsg()
	//开始或获取报名列表
	req.getMyanswer({'page':this.data.page}).then((res)=>{
		var data = res.data;
		app.hideLoad()
		var current_page = that.data.page
		var answerData = [...that.data.myAnswer,...data.userAnswer];
		console.log(answerData)
		this.setData({
			page:current_page+1,
			answerPageCount:data.pageCount,
			myAnswer:answerData,
			isScroll:true
		})
	}).catch(req.showErr)
  },
  getMyWeekAct(e){
  	if(!this.data.isWeekScroll){
  		app.showMsg('太快了，别急')
  		return false;
  	}
  	// this.scrollDom('week')
  	var that = this;
  	if(this.data.weekPageCount !=0 && this.data.weekPage >= this.data.weekPageCount){
  		app.showMsg('没有更多数据了')
  		this.setData({
  			isWeekScroll:true
  		})
  		return false;
  	}
  	var data = {
  		'page':this.data.weekPage
  	}
  	req.getWeekAct(data).then((res)=>{
		var current_page = that.data.weekPage
  		var currentData = [...that.data.weekList,...res.data.data]
  		if(res.data.data){
  			that.setData({
  				weekPageCount:data.count,
  				weekList:currentData,
  				isWeekScroll:true,
				weekPage:that.data.weekPage+1,
  			})
  		}
  	}).catch(req.showErr)
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  //请假
  leaveAnswer(e){
		var that = this;
		// if(this.data.isClick){
		// 	app.showMsg('太快了，别急')
		// 	return false
		// }
		this.setData({
			isClick:true
		})
		wx.showModal({
			title: '提示',
			content: '请假会获得黄牌',
			success (res) {
				if (res.confirm) {
					var data = e.currentTarget;
					var leaveData = {
						'aid':data.dataset.aid
					}
					req.leaveAnswer(leaveData).then((res)=>{
						console.log(res)
						if(res.data.status == 1){
							that.setData({
								isClick:false
							})
							//循环查找更改的活动
							var myAnswer = that.data.myAnswer
							for (let row of myAnswer) {
								row.leave_status = 1;
							}
							that.setData({
								myAnswer:myAnswer
							})
							console.log(that.data.myAnswer)
						}
						
					}).catch(app.showErr)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
  },
  // 取消报名
  cancelAnswer(e){
		var that = this;
		if(this.data.isClick){
			app.showMsg('太快了，别急')
			return false
		}
		this.setData({
			isClick:true
		})
		wx.showModal({
			title: '提示',
			content: '取消后无法再报名',
			success (res) {
				if (res.confirm) {
					var data = e.currentTarget;
					var leaveData = {
						'aid':data.dataset.aid
					}
					req.cancelAnswer(leaveData).then((res)=>{
						console.log(res)
						if(res.data.status == 1){
							that.setData({
								isClick:false
							})
							//循环查找更改的活动
							var myAnswer = that.data.myAnswer
							for (let row of myAnswer) {
								row.apply_status = 1;
							}
							that.setData({
								myAnswer:myAnswer
							})
							console.log(that.data.myAnswer)
						}
						
					}).catch(app.showErr)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
  },
  //去个人编辑页面
  goInfo(){
	  wx.navigateTo({
		  url:'./info/info'
	  })
  },
  // 去筛选「
  goFilter(e){
	  const val = e.currentTarget.dataset.id;
	  wx.navigateTo({
		  url:'/pages/user/founder/filter',
		  events:{
			  
		  },
		  success:function(res){
			  res.eventChannel.emit('actInfo',{data:val})
		  }
	  })
  }
})