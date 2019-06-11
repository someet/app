const formatTime = t => {
  var date = new Date(t*1000);
  var weekday=["周日","周一","周二","周三","周四","周五","周六"];
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const week = date.getDay()
  // return [year, month, day].map(formatNumber).join('/') + ' ' +weekday[week] +' ' [hour, minute].map(formatNumber).join(':')
  return formatNumber(month)+'/'+formatNumber(day) +'/ '+' '+weekday[week]+' '+formatNumber(hour)+':'+formatNumber(minute)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight/originalWidth;//图片高宽比
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight/windowWidth;//屏幕高宽比        imageSize.imageWidth = windowWidth;
       var scale = windowWidth/originalWidth
       console.log(scale)
       imageSize.imageHeight = originalHeight * scale;
      imageSize.imageWidth = windowWidth
    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}
 
module.exports = {
  formatTime: formatTime,
  imageUtil: imageUtil
}