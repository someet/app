var user = require('../../common/user.js');
Page({
  data: {
  },
  onGetUserInfo(e){
  	console.log(e)
  	try {
	  wx.setStorageSync('userInfoForSave', e.detail.userInfo)
	} catch (e) {}
	//先获取openid 再查询是否存在 不存在则创建
  }
})