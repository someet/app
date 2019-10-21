var req = require('../../../common/request.js');
var app = getApp()
Page({
	data: {
		id:0,
		page:1,
		selectedItem:'wait',
		list:[],
		selectItemId:0,
		hiddenView:true,
		rejectData:{
			id:0,
			user_id:0,
			type:'reject',
			reject_reason:''
		},
		waitList:[],
		rejectList:[],
		leaveList:[],
		passList:[],
		isClick:0
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
			var data = res.data.data
			that.setData({
				page:that.data.page++,
				list:data,
				passList:data.passList,
				waitList:data.waitList,
				rejectList:data.rejectList,
				leaveList:data.leaveList,
			})
			console.log(that.waitList)
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
	},
	// 查看详情
	goDetail(){
		wx.redirectTo({
			url:'/pages/detail/detail?id='+this.data.id
		})
	},
	// 筛选
	filterUser(e){
		var user_id = e.currentTarget.dataset.user_id
		var activity_id = this.data.id
		var answer_id = e.currentTarget.dataset.answer_id
		var type = e.currentTarget.dataset.type
		var that = this
		if(type == 'pass'){
			wx.showModal({
			  title: '提示',
			  content: '选择后无法取消',
			  success (res) {
			    if (res.confirm) {
			      //确认通过或者拒绝
				  var data = {
					  'activity_id':activity_id,
					  'answer_id':answer_id,
					  'user_id':user_id,
					  'type':type,
					  'reject_reason':''
				  }
				  req.filterAnswer(data).then((res)=>{
					  if(res.data.status == 1){
						  var waitList = that.data.waitList
						  var passList = that.data.passList
						  //循环把通过的写入
						  for (let [key,val] of waitList.entries()) {
						  	if(val.id == data.answer_id){
						  		passList.push(waitList[key])
								waitList.splice(key,1)
						  		break;
						  	}
						  }
						  that.setData({
						  	isClick:0,
						  	hiddenView:true,
						  	waitList:waitList,
						  	passList:passList
						  })
					  }
				  })
			    } else if (res.cancel) {
			      console.log('用户点击取消')
			    }
			  }
			})
		}else{
			var reject = {
				'activity_id':activity_id,
				'answer_id':answer_id,
				'user_id':user_id,
				'type':type,
				'reject_reason':''
			}
			this.setData({
				rejectData:reject,
				hiddenView:false,
			})
		}
	},
	hiddenView(){
		this.setData({
			hiddenView:true
		})
	},
	// 拒绝理由
	rejectSubmit(e){
		if(this.data.isClick){
			app.showMsg('请稍后')
			return false;
		}
		this.setData({
			isClick:1
		})
		var data = this.data.rejectData
		console.log(e.detail.value.reject_reason)
		var reason = e.detail.value.reject_reason;
		data.reject_reason = reason
		var that = this
		this.setData({
			rejectData:data
		})
		if(!reason){
			app.showMsg('请填写拒绝理由')
			return false
		}
		if(!data.activity_id || !data.user_id || !data.answer_id){
			app.showMsg('参数错误')
			return false
		}
		req.filterAnswer(data).then((res)=>{
			if(res.data.status == 1){
				var waitList = that.data.waitList
				var rejectList = that.data.rejectList
				//循环把通过的写入
				for (let [key,val] of waitList.entries()) {
					if(val.id == data.answer_id){
						rejectList.push(waitList[key])
						waitList.splice(key,1)
						break;
					}
				}
				that.setData({
					isClick:0,
					hiddenView:true,
					rejectList:rejectList,
					waitList:waitList
				})
			}else{
				app.showMsg();
			}
		})
	}
})