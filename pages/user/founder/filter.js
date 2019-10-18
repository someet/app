var req = require('../../../common/request.js');
var app = getApp()
Page({
	data: {
		id:0,
		page:1,
		selectedItem:'wait',
		list:[],
		selectItemId:0
	},
	onLoad(){
		var that = this
		// actInfo
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('actInfo', function(data){
			that.setData({
				id:data.data
			})
		});
		this.getAnswer()
	},
	//获取所筛选的活动详情和报名人员
	getAnswer(){
		var that = this
		var id = this.data.id
		var page = this.data.page;
		req.getAnswers({'id':id}).then((res)=>{
			console.log(res)
			that.setData({
				page:that.data.page++,
				list:res.data.data
			})
			console.log(that.data.data)
		})
	},
	//切换选项卡
	changeItem(e){
		var item = e.currentTarget.dataset.item
		this.setData({
			selectedItem:item
		})
	},
	// 展开筛选
	showAnswer(e){
		const val = e.currentTarget.dataset.id;
		console.log(val)
		this.setData({
			selectItemId:val
		})
	}
})