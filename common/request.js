const baseApiUrl = 'http://mac.ngrok.wdevelop.cn/v1'; //imac 测试连接
// const baseApiUrl = 'https://someetapi.someet.cc/v1'; //测试服 测试连接
var userFunc = require('./user.js');
// const baseApiUrl = 'http://dubin.ngrok.wdevelop.cn/v1'  //mac air 测试连接
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
			  	url:baseApiUrl+'/wechat/login',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取首页列表
	getIndexList(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
			  	url:baseApiUrl+'/activity/index',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	createUser(data){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
			  	url:baseApiUrl+'/user/create-user',
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
			  	url:baseApiUrl+'/user/get-info',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	getToken(){
		var info = wx.getStorageSync('userInfo')
		if(info.access_token) return info.access_token
		return '';
	},
	getHeader(){
		var token = this.getToken();
		this.header.Authorization = 'Bearer '+token
		return this.header
	},
	getHeaderForUpload(){
		var token = this.getToken();
		var headerForUpload = {
			'Authorization':'Bearer '+token
		}
		return headerForUpload
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
			  	url:baseApiUrl+'/activity/view',
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
			  	url:baseApiUrl+'/answer/check-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//开始报名流程
	startAnswer(){
		var that = this;
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:{},
			  	url:baseApiUrl+'/answer/create',
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
			  	url:baseApiUrl+'/activity/get-question',
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
			  	url:baseApiUrl+'/answer/create-answer',
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
			  	url:baseApiUrl+'/user/get-answers',
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
				url:baseApiUrl+'/user/get-week-act',
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
				url:baseApiUrl+'/user/get-history-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我发起的活动
	getWeekActForAnswer(data){
		var that = this 
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:baseApiUrl+'/user/get-week-act-for-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取我发起的活动
	getHistoryActForAnswer(data){
		var that = this 
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:baseApiUrl+'/user/get-history-act-for-answer',
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
				url:baseApiUrl+'/user/cancel-answer',
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
				url:baseApiUrl+'/user/leave-answer',
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
				method:'get',
				url:baseApiUrl+'/user/get-info',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取个人信息
	getBaseInfo(id){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:{'id':id},
				method:'get',
				url:baseApiUrl+'/user/get-base-info',
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
				url:baseApiUrl+'/user/get-mytags',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	// 添加我自定义的标签
	addMyTga(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/add-user-tags',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//保存我选择的标签
	saveTags(data,type){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/save-tags?id='+type,
				
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//删除uga 
	delUgaAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/delete-uga-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取回答uga 问题页面的额初始化信息
	getUgaPageInfo(id){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'get',
				data:{'uga_id':id},
				url:baseApiUrl+'/user/get-uga-page',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//更换uga问题
	changeQuestion(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/change-uga-question',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//保存我的Uga 
	saveUgaAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/add-uga-answer',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	// 虎丘手机号
	getPhoneNumber(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/wechat/get-phone-number',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//保存个人信息
	saveUserInfo(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'post',
				data:data,
				url:baseApiUrl+'/user/save-user-info',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取黄牌记录
	getYellowCard(){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:{},
				url:baseApiUrl+'/yellowcard/get-yellow-card',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},                                                                                                                                                                                                                                                                       
	//提交记录
	submitAppeal(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/yellowcard/yellow-appeal-reason',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取待选人员
	getAnswers(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'get',
				url:baseApiUrl+'/answer/get-filter-answers',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	filterAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/answer/filter-answers',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	getFeedBackAnswer(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'get',
				url:baseApiUrl+'/answer/get-feedback-answers',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//添加发起人反馈
	addFounderFeedback(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/answer/add-founder-feedback',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取坏理由
	getBadReason(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/activity/get-bad-reason',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	addUserFeedback(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:baseApiUrl+'/answer/add-user-feedback',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//随机获取三个活动
	getRandAct(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				url:baseApiUrl+'/activity/rand-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//发布活动
	releaseAct(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/activity/release-act',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//获取验证码
	getVerifyCode(data){
		// get-verify-code
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'get',
				url:baseApiUrl+'/user/get-verify-code',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//验证验证码
	verifyCode(data){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				data:data,
				method:'post',
				url:baseApiUrl+'/user/verify-code',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	},
	//check userinfo complete
	checkUserInfoComplete(){
		var that = this
		return new Promise((resolve,reject)=>{
			wx.request({
				header:that.getHeader(),
				method:'get',
				url:baseApiUrl+'/user/check-userinfo-complete',
				success:(res)=>resolve(res.data),
				fail:(err)=>reject(err)
			})
		})
	}
}
module.exports = request;