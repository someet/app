//index.js
//获取应用实例
var req = require('../../../common/request.js');
const app = getApp()
Page({
	data: {
		screenHeight:0,
		screenHeightForH:0,
		weekList:[],
		historyList:[],
		weekPage:1,
		weekPageCount:0,
		historyPage:1,
		historyPageCount:0,
		isWeekScroll:true,
		isHistoryScroll:true,
		tagList:'',
		currentItem:'',
		id:0
	},
	onLoad: function(options) {
		var id = options.id
		this.setData({
			id:id
		})
		var that = this
		// 获取屏幕高度
		wx.getSystemInfo({
			success (res) {
				that.setData({
					screenHeight:(res.windowHeight - res.statusBarHeight - 48 - 32 - 48)/3,
					screenHeightForH:(res.windowHeight - res.statusBarHeight - 48 - 32 - 48)/1.5
					
				})
				console.log(that.data.screenHeight)
			}
		})
		this.getCateById();
	},
	getCateById(){
		var that = this
		var data = {
			'id':this.data.id
		}
		req.getCateById(data).then((res)=>{
			console.log(res)
			if(res.data.status == 1){
				that.setData({
					tagList:res.data.data,
					currentItem:res.data.data[0]
				})
				that.getWeekAct()
				that.getHistoryAct()
			}
		})
	},
	// 切换选项卡
	changeTab(e){
		var id = e.currentTarget.dataset.id
		this.setData({
			'currentItem':id
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
			'isCollect':0,
			'type_id':this.data.currentItem.id
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
			'isCollect':0,
			'type_id':this.data.currentItem.id
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
})
