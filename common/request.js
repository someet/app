const basApiUrl = 'http://mac.ngrok.wdevelop.cn/v1';
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
			  	url:basApiUrl+'/wechat/login',
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
			  	url:basApiUrl+'/user/get-info',
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
			  	url:basApiUrl+'/activity/view',
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
			  	url:basApiUrl+'/answer/check-answer',
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
			  	url:basApiUrl+'/answer/create',
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
			  	url:basApiUrl+'/activity/get-question',
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
			  	url:basApiUrl+'/answer/create-answer',
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
			  	url:basApiUrl+'/user/get-answers',
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
				url:basApiUrl+'/user/get-week-act',
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
				method:'post',
				url:basApiUrl+'/user/get-history-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	// 取消活动
	cancelAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:basApiUrl+'/user/cancel-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	// 请假
	leaveAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:basApiUrl+'/user/leave-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取个人信息
	getInfo(id){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:{'id':id},
				method:'post',
				url:basApiUrl+'/user/get-info',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我选择的标签和未选择的单分类标签
	getMyTags(type){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'get',
				data:{'type':type},
				url:basApiUrl+'/user/get-mytags',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	}
}
module.exports = request;