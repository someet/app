const basApiUrl = 'http://dubin.ngrok.wdevelop.cn';
const request = {
	header : {
		'Authorization':'',
		'content-type':'application/x-www-form-urlencoded;charset=utf-8'
	},
	//小程序登录获取openid
	getWxId(data){
		return new Promise((resolve,reject)=>{
			wx.request({
				data:data,
			  	url:basApiUrl+'/v1/wechat/login',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取用户信息
	getUserInfo(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
			  	url:basApiUrl+'/v1/user/get-info',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	getToken(){
		return '6tN6fgDZhdq5k4-dNa-yb36b7LDY67bh';
	},
	getHeader(){
		var token = this.getToken();
		this.header.Authorization = 'Bearer '+token
		return this.header
	},
	showErr(err) {
		if (!typeof err === 'string') {
		    err = err.msg || err || err.errmsg || err.errMsg || (err.detail && err.detail.errMsg) || '未知错误';
		}else{
			err = '服务器错误';
		}
		wx.hideLoading()
		wx.showModal({
		showCancel: false,
			content: err
		});
	},
	getView(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
			  	url:basApiUrl+'/v1/activity/view',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	// 报名前的检查
	checkAnswer(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
			  	url:basApiUrl+'/v1/answer/check-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//开始报名流程
	startAnswer(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
			  	url:basApiUrl+'/v1/answer/create',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	}
}

module.exports = request;