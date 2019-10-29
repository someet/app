var req = require('../../../common/request.js');
var app = getApp()
Page({
	data: {
		activeTab:'all',
		screenHeight:0,
		weekList:[],
		historyList:[],
		weekPage:1,
		weekPageCount:0,
		historyPage:1,
		historyPageCount:0,
		isWeekScroll:true,
		isHistoryScroll:true,
		isCollect:0
	},
	changeTab(e){
		var type = e.currentTarget.dataset.type 
		console.log(type)
		if(type != this.data.activeTab){
			this.setData({
				weekList:[],
				historyList:[],
				weekPage:1,
				weekPageCount:0,
				historyPage:1,
				historyPageCount:0,
				activeTab:type
			})
			if(type == 'collect') {
				this.setData({
					isCollect:1
				})
			}else{
				this.setData({
					isCollect:0
				})
			}
			this.getWeekAct()
			this.getHistoryAct()
		}
	},
	onLoad(){
		var that = this
		// 获取屏幕高度
		wx.getSystemInfo({
			success (res) {
				that.setData({
					screenHeight:(res.windowHeight - res.statusBarHeight - 48 - 32 - 48)/2
				})
				console.log(that.data.screenHeight)
			}
		})
		this.getWeekAct()
		this.getHistoryAct()
	},
	// 获取本周我发起的活动
	getWeekAct(){
		if(!this.data.isWeekScroll){
			app.showMsg('太快了，别急')
			return false;
		}
		app.loadMsg();
		this.scrollDom('week')
		var that = this;
		if(this.data.weekPageCount !=0 && this.data.weekPage >= this.data.weekPageCount){
			app.showMsg('没有更多数据了')
			this.setData({
				isWeekScroll:true
			})
			return false;
		}
		var data = {
			'page':this.data.weekPage,
			'isCollect':this.data.isCollect
		}
		req.getWeekActForAnswer(data).then((res)=>{
			var data = res.data 
			app.hideLoad()
			var currentData = [...that.data.weekList,...data.data]
			if(data.data){
				that.setData({
					weekPageCount:data.count,
					weekList:currentData,
					isWeekScroll:true
				})
			}
		}).catch(req.showErr)
		that.setData({
			weekPage:that.data.weekPage+1,
		})
	},
	// 获取我发起的历史活动
	getHistoryAct(){
		if(!this.data.isHistoryScroll){
			app.showMsg('太快了，别急')
			return false;
		}
		app.loadMsg();
		this.scrollDom('history')
		var that = this;
		if(this.data.historyPageCount !=0 && this.data.historyPage >= this.data.historyPageCount){
			app.showMsg('没有更多数据了')
			this.setData({
				isHistoryScroll:true
			})
			return false;
		}
		var data = {
			'page':this.data.historyPage,
			'isCollect':this.data.isCollect
		}
		req.getHistoryActForAnswer(data).then((res)=>{
			app.hideLoad()
			var data = res.data 
			var currentData = [...that.data.historyList,...data.data]
			if(data.data){
				that.setData({
					historyPageCount:data.count,
					historyList:currentData,
					isHistoryScroll:true
				})
			}

		}).catch(req.showErr)
		that.setData({
			historyPage:that.data.historyPage+1,
		})
	},
	scrollDom(type){
		if(type == 'week'){
			this.setData({
				isWeekScroll:false
			})
		}
		if(type == 'history'){
			this.setData({
				isHistoryScroll:false
			})
		}
	},
	//反馈
	goFeedback(e){
		var id = e.currentTarget.dataset.id
		console.log(id)
		wx.navigateTo({
			url:'/pages/user/feedback/feedback',
			events:{
				
			},
			success:function(res){
				res.eventChannel.emit('actInfo',{id:id})
			}
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
})