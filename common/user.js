var req = require('./request.js');
const user = {
	//获取用户的存储的信息
	checkUserInfo(){
		var that = this
		wx.checkSession({
		  success () {
		  		//获取openid 或者unioid
		  		var idInfo = wx.getStorageSync('session')
				if(!idInfo || !idInfo.session_key){
					wx.login({
						success:function(res){
							var data = {'code':res.code}
							req.getWxId(data).then((res)=>{
								wx.setStorageSync('session', res.data)
								idInfo = res.data
								//检查是否保存了用户信息
								var userInfo = wx.getStorageSync('userInfo')
								if(typeof(userInfo) == undefined || !userInfo.id){
									//查询用户信息并保存
									// 正式服务使用unioid 测试服务无法绑定开放平台
									var unionid = idInfo.unionid;
									console.log(req)
									req.getUserInfo({'unionid':unionid}).then((res)=>{
										if(res.data){
											wx.setStorageSync('userInfo', res.data.data)
										}else{
											//不存在的用户，无法自动获取信息，则去个人中心时在绑定新的用户
										}
									})
								}
							})
						}
					})
				}else{
					//检查是否保存了用户信息
					var userInfo = wx.getStorageSync('userInfo')
					console.log(userInfo)
					if(typeof(userInfo) == undefined || !userInfo.id){
						//查询用户信息并保存
						// 正式服务使用unioid 测试服务无法绑定开放平台
						var unionid = idInfo.unionid;
						console.log(req)
						req.getUserInfo({'unionid':unionid}).then((res)=>{
							if(res.data){
								wx.setStorageSync('userInfo', res.data.data)
							}else{
								//不存在的用户，无法自动获取信息，则去个人中心时在绑定新的用户
							}
						})
					}else{
						console.log('有缓存')
					}
				}
		  },
		  fail () {
		  	console.log('登录失败了')
		    // session_key 已经失效，需要重新执行登录流程
			var that = this
		    wx.login({
		    	success:function(res){
		    		console.log('尝试登陆')
		    		var data = {'code':res.code}
		    		req.getWxId(data).then((res)=>{
		    			wx.setStorageSync('session', res.data)
						var idInfo = res.data
						var userInfo = wx.getStorageSync('userInfo')
						if(typeof(userInfo) == undefined || !userInfo.id){
							//查询用户信息并保存
							// 正式服务使用unioid 测试服务无法绑定开放平台
							var unionid = idInfo.unionid;
							console.log(req)
							req.getUserInfo({'unionid':unionid}).then((res)=>{
								if(res.data){
									wx.setStorageSync('userInfo', res.data.data)
								}else{
									//不存在的用户，无法自动获取信息，则去个人中心时在绑定新的用户
									//跳转到登录界面
									wx.redirectTo({
										url:'/pages/user/user'
									})
								}
							})
						}
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
		return []
	},
	setUserInfoByUnionId(){
		var idInfo = wx.getStorageSync('session')
		var unionid = idInfo.unionid
		try {
		  req.getUserInfo({'unionid':unionid}).then((res)=>{
		  	if(res.data){
		  		wx.setStorageSync('userInfo', res.data.data)
		  	}else{
		  		//不存在的用户，无法自动获取信息，则去个人中心时在绑定新的用户
		  	}
		  })
		} catch (e) {
		  // Do something when catch error
		}
	},
	checkUserInfoComplete(){
		console.log('刷新信息')
		var userInfoComplete = 'complete';
		var value = wx.getStorageSync('userInfo')
		if(!value.uga || value.uga.length == 0){
			userInfoComplete = 'uga'
		}
		if(!value.tags || value.tags.length == 0){
			userInfoComplete = 'tags'
		}
		if(!value.wechat_id || !value.mobile){
			userInfoComplete = 'baseInfo'
		}
		wx.setStorageSync('userInfoComplete', userInfoComplete)
		return userInfoComplete;
	},
	setUserInfo(data){
		console.log('setUser')
		wx.setStorageSync('userInfo', data)
	},
	resetUserInfo(){
		var idInfo = wx.getStorageSync('session')
		var unionid = idInfo.unionid
		req.getUserInfo({'unionid':unionid}).then((res)=>{
			if(res.data){
				wx.setStorageSync('userInfo', res.data.data)
			}
		})
	}
}
module.exports = user;