//index.js
//获取应用实例
var req = require('../../../common/request.js');
const app = getApp()
Page({
	data: {
		type:''
	},
	onLoad: function(options) {
		this.getAllCate();
	},
	getAllCate(){
		var that = this
		req.getAllCate().then((res)=>{
			console.log(res)
			if(res.data.status == 1){
				that.setData({
					type:res.data.data
				})
			}else{
				app.showMsg('信息错误');
			}
		})
	},
	goCategory(e){
		var id = e.currentTarget.dataset.id
		wx.navigateTo({
			url:'/pages/index/cate/category?id='+id
		})
	}
})
