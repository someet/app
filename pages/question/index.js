var app = getApp();
var req = require('../../common/request.js');
Page({
	data:{
		isClickUpload:false,
		apiUrl:app.globalData.apiUrl,
		question_image:'',
		id:0,
		question_item:[],//问题了列表
		anwerList:[]//答案列表
	},
  onLoad(options) {
    console.log(options)
		this.setData({
			id:options.id
		})
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
				}
			})
		}else{
			app.showMsg('正在处理，请稍后');
		}
	},
	//创建报名信息
	createAnswer(e){
		//检查问题是否为空值
		console.log(e.detail)
		//检查回答的问题是否完整
		var formData = e.detail.value;
		for (let index of Object.keys(formData)) {
			console.log(index+'----'+formData[index])
			if(!formData[index]){
					app.showMsg('请完整的回答问题')
					return false
			}
		}
		//组装数据发送到后台
		var data;
		data = e.detail.value
		//发送数据
		req.createAnswer(data).then((res)=>{
			console.log(res)
			if(res.data.status != 0){
				app.showMsg(res.data.msg);
				if(res.data.status == 1){
					//跳转到报名成功页面
				}else if(res.data.status == 2){
					//跳转到填写标签页面
				}
			}
		}).catch(req.showErr)
	}
})