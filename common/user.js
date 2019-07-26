var req = require('./request.js');
const user = {
	//获取用户的存储的信息
	checkUserInfo(){
		var that = this
		wx.checkSession({
		  success () {
		  		//获取openid 或者unioid
		  		var idInfo = wx.getStorageSync('session')
		  		//检查是否保存了用户信息
		  		var userInfo = wx.getStorageSync('userInfo')
		  		if(typeof(userInfo) == undefined || !userInfo.id){
		  			//查询用户信息并保存
		  			// 正式服务使用unioid 测试服务无法绑定开放平台
		  			var unionid = idInfo.unionid;
					console.log(req)
		  			req.getUserInfo({'unionid':'o28P7ww3frRs9FoLRqbmr_EVKuxg'}).then((res)=>{
		  				if(res.data){
		  					wx.setStorageSync('userInfo', res.data.data)
		  				}else{
		  					//不存在的用户，无法自动获取信息，则去个人中心时在绑定新的用户
		  				}
		  			})
		  		}
		  },
		  fail () {
		    // session_key 已经失效，需要重新执行登录流程
		    wx.login({
		    	success:function(res){
		    		var data = {'code':res.code}
		    		req.getWxId(data).then((res)=>{
		    			console.log(res)
		    			wx.setStorageSync('session', res.data)
		    		})
		    	}
		    })
		  }
		})
	},
	getUserInfo(){
		try {
		  var value = wx.getStorageSync('userInfo')
		  if (value) {
		    return value
		  }
		} catch (e) {
		  // Do something when catch error
		}
	}
}
module.exports = user;