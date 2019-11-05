var userFunc = require('../../../common/user.js');
var req = require('../../../common/request.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
	data: {
		showReason:false,
		type:0,
		isClickUpload:false,
		reportImg:''
	},
	onLoad() {
	},
	//提交申诉
	reportSubmit(e){
		console.log(e)
		var data = {
			imageArr:saveImg,
			content:e.detail.value.content,
			type:this.data.type
		}
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
			type:type
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
