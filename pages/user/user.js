var user = require('../../common/user.js');
var imageUtil = require('../../utils/util.js');
Page({
  data: {
  	imagefirstsrc: 'https://img.someet.cc/WechatIMG63.jpeg',//图片链接
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
  },
  onGetUserInfo(e){
  	console.log(e)
  	try {
	  wx.setStorageSync('userInfoForSave', e.detail.userInfo)
	} catch (e) {}
	//先获取openid 再查询是否存在 不存在则创建
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  onPageScroll:function(e){
   if(e.scrollTop<0){
     wx.pageScrollTo({
       scrollTop: 0
     })
  }
 }
})