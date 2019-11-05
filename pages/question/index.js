var app = getApp();
var user = require('../../common/user.js');
var req = require('../../common/request.js');
Page({
	data:{
		isClickUpload:false,
		apiUrl:app.globalData.apiUrl,
		question_image:'',
		id:0,
		question_item:[],//问题了列表
		anwerList:[],//答案列表,
		isClick:0,
		founderInfo:{}
	},
  onLoad(options) {
		var that = this;
		console.log(options)
		this.setData({
			id:options.id
		})
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('founderInfo', function(data){
			console.log(data)
			that.setData({
				founderInfo:data.data
			})
		});
		//获取该活动的问题列表
		this.getQuestion(this.data.id);
  },
	//获取活动问题
	getQuestion(id){
		app.loadMsg();
		req.getQuestion(id).then((res)=>{
			var data = res.data;
			if(data.status == 1){
				var answer = [];
				for (let [index,val] of data.data.entries()) {
					answer[index] = '';
				}
				console.log(answer)
				this.setData({
					question_item:data.data,
					answerList:answer
				})
				app.hideLoad();
			}
		}).catch(req.showErr)
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
								'type': 'question_image'
							},
							success (res){
								const data = JSON.parse(res.data).data
								console.log(data)
								if(data.status == 200){
									that.setData({
										question_image:data.url,
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
	//创建报名信息
	createAnswer(e){
		if(this.data.isClick == 1){
			return false
		}
		this.setData({
			isClick:1
		})
		//检查问题是否为空值
		console.log(e.detail)
		//检查回答的问题是否完整
		var formData = e.detail.value,that = this;
		for (let index of Object.keys(formData)) {
			console.log(index+'----'+formData[index])
			if(!formData[index]){
					app.showMsg('请完整的回答问题')
					return false
			}
		}
		//发送数据
		req.createAnswer(formData).then((res)=>{
			if(res.data.status != 0){
				app.showMsg(res.data.msg);
				if(res.data.status == 1){
					//跳转到报名成功页面
					wx.redirectTo({
						url:'/pages/user/answer/finish/finish'
					})
				}else if(res.data.status == 2){
					//跳转到填写标签页面
					wx.setStorageSync('editUserFrom', {'fromPage':'answer',id:0})
					user.checkUserInfoComplete()
					wx.redirectTo({
						url:'/pages/user/info/edit/edit'
					})
				}
				this.setData({
					isClick:0
				})
			}
		}).catch(req.showErr)
	}
})