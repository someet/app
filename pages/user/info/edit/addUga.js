var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		uga_id:0,
		question:'',
		answer:'',
		curItem:0,
		rest:0,
		isChange:0,
		isSave:0,
		question_id:0,
		question_nums:1,
		editOrAdd:'new'
	},
	onLoad(options){
		var id;
		id = typeof(options.id) == 'undefined' ? 0:options.id
		const that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('editUgaIndex', function(data){
			console.log(data)
			that.setData({
				uga_id:data.id,
				editOrAdd:data.type
			})
		});
		this.getPageInfo()
	},
	//更换问题
	changeQuestion(){
		if(this.data.isChange){
			return false;
		}
		this.setData({
			isChange:1
		})
		app.loadTitle('正在寻找问题...')
		if(this.data.question_id == 0 || !this.data.question_id){
			app.showMsg('没有问题啦')
			return false;
		}
		var that = this;
		req.changeQuestion({'uga_id':this.data.question_id}).then((res)=>{
			console.log(res)
			this.setData({
				isChange:0
			})
			app.hideLoad()
			if(res.data.status== 1){
				var question_nums = that.data.question_nums + 1;
				if(question_nums > 50) question_nums = 1;
				var data = res.data.data
				that.setData({
					question:data.content,
					answer:'',
					rest:data.rest,
					question_id:data.id,
					question_nums:question_nums
				})
			}else{
				app.showMsg('数据出问题啦')
			}
			
		})
	},
	//获取初始信息
	getPageInfo(){
		var that = this
		app.loadMsg('正在下载数据。。。')
		var id = this.data.uga_id
		req.getUgaPageInfo(id).then((res)=>{
			if(res.data.status == 1){
				var data = res.data.data
				console.log(data)
				that.setData({
					question:data.ugaData.content,
					answer:data.answer,
					curItem:data.curItem,
					rest:data.rest,
					question_id:data.ugaData.id
				})
			}
			app.hideLoad()
		})
	},
	//输入框失去焦点
	textbindblur(e){
		this.setData({
			answer:e.detail.value
		})
	},
	//保存结果并返回
	saveAndBack(){
		//保存我的答案
		console.log(this.data.answer)
		if(!this.data.answer){
			app.showMsg('请填写答案')
			return false;
		}
		if(this.data.isSave){
			return false
		}
		this.setData({
			isSave:1
		})
		var val = this.data.answer,that = this
		app.loadTitle('保存中...')
		req.saveUgaAnswer({
			'question_id':that.data.question_id,
			'question_answer':that.data.answer,
			'question':that.data.question,
			'uga_id':that.data.uga_id
		}).then((res)=>{
			console.log(res)
			that.setData({
				isSave:0
			})
			if(res.data.status == 1){
				app.hideLoad()
				var data = res.data.data
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('changeUgaById',data);
				wx.navigateBack({
				  delta: 1
				})
			}
		})
	}
})