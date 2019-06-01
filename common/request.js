const basApiUrl = 'http://dubin.ngrok.wdevelop.cn';
const request = {
	header : {
		'Authorization':''
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
	errPicker(err) {
		  if (typeof err === 'string') {
		    return err;
		  }

		  return err.msg || err.errMsg || (err.detail && err.detail.errMsg) || '未知错误';
	},
	showErr(err) {
		const msg = errPicker(err);
		wx.showModal({
		showCancel: false,
			content: msg
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