const basApiUrl = 'http://dubin.ngrok.wdevelop.cn';
const request = {
	header : {
		'Authorization':'',
		'content-type':'application/x-www-form-urlencoded'
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
		return 'iVHFPhHKUaQg6jPUJRNoFhvQVw33eArt';
	},
	getHeader(){
		var token = this.getToken();
		this.header.Authorization = 'Bearer '+token
		return this.header
	},
	showErr(err) {
		console.log(err)
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
	},
	//获取活动的问题列表
	getQuestion(id){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'get',
				data:{'id':id},
			  	url:basApiUrl+'/v1/activity/get-question',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//创建报名事件
	createAnswer(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
			  	url:basApiUrl+'/v1/answer/create-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我报名的活动列表
	getMyanswer(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'get',
				data:data,
			  	url:basApiUrl+'/v1/user/get-answers',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我发起的活动
	getWeekAct(data){
		var that = this 
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:basApiUrl+'/v1/user/get-week-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我发起的活动
	getHistoryAct(data){
		var that = this 
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:basApiUrl+'/v1/user/get-history-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	}
}
module.exports = request;