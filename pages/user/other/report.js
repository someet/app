var userFunc = require('../../../common/user.js');
var req = require('../../../common/request.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
	data: {
		showReason:false,
		type:0,
		isClickUpload:false,
		reportImg:'',
		selectText:'',
		allReason:''
	},
	onLoad() {
		var text = ['我要提供产品反馈、报告错误','有人发送骚扰营销广告','有人发送色情低俗内容','有人恶意骚扰发送不文明内容','我发现了疑似传销、违规直销等行为'];
		this.setData({
			allReason:text
		})
	},
	//提交申诉
	reportSubmit(e){
		console.log(e)
		var saveImg = this.data.reportImg
		var data = {
			imageArr:saveImg,
			content:e.detail.value.content,
			type:this.data.type
		}
		app.loadTitle('正在提交...')
		req.subReport(data).then((res)=>{
			app.hideLoad();
			console.log(res)
			if(res.data.status == 1){
				app.showMsg(res.data.data)
				wx.switchTab({
					urlL:'/pages/user/user'
				})
			}else{
				app.showMsg('提交失败')
			}
		})
	},
	showReason(){
		this.setData({
			showReason:!this.data.showReason
		})
		console.log(this.data.showReason)
	},
	selectedType(e){
		var type = e.currentTarget.dataset.type
		this.setData({
			type:type,
			showReason:!this.data.showReason,
			selectText:this.data.allReason[type]
		})
	},
	uploadImage(){
		var that = this;
		if(!this.data.isClickUpload){
			this.setData({
				isClickUpload:true
			})
			wx.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success (res) {
					const tempFilePaths = res.tempFilePaths
					wx.uploadFile({
							url: that.data.apiUrl+'/back/upload/upload-file', 
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'type': 'report'
							},
							success (res){
								const data = JSON.parse(res.data).data
								console.log(data)
								if(data.status == 200){
									that.setData({
										reportImg:data.url,
									})
									app.showMsg('上传成功');
								}
							}
					})
				},
				fail(res){
					that.data.isClickUpload = false
				}
			})
		}else{
			app.showMsg('正在处理，请稍后');
		}
	},
})
