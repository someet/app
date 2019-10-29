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
	//预览活动
	goPreview(e){
		var id = e.currentTarget.dataset.id
		wx.redirectTo({
			url:'/pages/detail/detail?id='+id
		})
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
		req.getWeekAct(data).then((res)=>{
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
		req.getHistoryAct(data).then((res)=>{
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
	//跳转反馈页面
	goFeedback(e){
		console.log(1111111)
		//把点击的活动传递到新页面
		var id = e.currentTarget.dataset.id
		var index = e.currentTarget.dataset.index
		wx.navigateTo({
			url:'/pages/user/founder/feedback/feedback',
			events:{
				
			},
			success:function(res){
				res.eventChannel.emit('actInfo',{id:id.id})
			}
		})
	}
})