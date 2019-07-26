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
		isScroll:true
	},
	changeTab(e){
		var type = e.currentTarget.dataset.type 
		console.log(type)
		this.setData({
		  activeTab:type
		})
		this.getHistoryAct()
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
		this.getHistoryAct()
	},
	// 获取本周我发起的活动
	getWeekAct(){
		if(!this.data.isScroll){
			app.showMsg('太快了，别急')
			return false;
		}
		this.scrollDom()
		var that = this;
		if(this.data.weekPageCount !=0 && that.data.weekPage > this.data.weekPageCount){
			app.showMsg('没有更多数据了')
			return false;
		}
		that.setData({
			weekPage:that.data.weekPage+1,
		})
		req.getWeekAct({'page':this.data.weekPage}).then((res)=>{
			var data = res.data 
			var currentData = [...that.data.weekList,...data.data]
			if(data.data){
				that.setData({
					weekPageCount:data.count,
					weekList:currentData,
					isScroll:true
				})
			}
		}).catch(req.showErr)
	},
	// 获取我发起的历史活动
	getHistoryAct(){
		if(!this.data.isScroll){
			app.showMsg('太快了，别急')
			return false;
		}
		this.scrollDom()
		var that = this;
		if(this.data.weekPageCount !=0 && that.data.weekPage > this.data.weekPageCount){
			app.showMsg('没有更多数据了')
			return false;
		}
		that.setData({
			historyPage:that.data.historyPage+1,
		})
		req.getHistoryAct({'page':this.data.historyPage}).then((res)=>{
			var data = res.data 
			var currentData = [...that.data.historyList,...data.data]
			if(data.data){
				that.setData({
					historyPageCount:data.count,
					historyList:currentData,
					isScroll:true
				})
			}

		}).catch(req.showErr)
	},
	scrollDom(){
		this.setData({
			isScroll:false
		})
	}
})