var req = require('../../common/request.js');
var app = getApp();
Page({
	data:{
		id:0,
		qrcode:'',
		isCheck:false
	},
	onLoad(options){
		var id = options.id
		this.setData({
			id:id
		})
		this.getQrcode()
	},
	//获取二维码
	getQrcode(){
		var that = this;
		req.getQrcode({'id':this.data.id}).then((res)=>{
			console.log(res)
			if(res.data.status == 1){
				that.setData({
					qrcode:res.data.data
				})
			}else{
				that.setData({
					isCheck:true
				})
				app.showMsg(res.data.data)
			}
		})
	}
})