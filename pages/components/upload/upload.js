var app = getApp();
var req = require('../../../common/request.js');
var user = require('../../../common/user.js');
Page({
	data: {
		src:'',
		width:400,//宽度
		height: 400,//高度
		imgIndex:'',
		apiUrl:app.globalData.apiUrl,
		uploadType:'profile'
	},
	onLoad: function (options) {
		var that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('imgIndex', function(data){
			console.log(data)
			that.setData({
				imgIndex:data.data
			})
		});
		eventChannel.on('uploadType', function(data){
			console.log(data)
			that.setData({
				uploadType:data.type
			})
		});
		//获取到image-cropper对象
		this.cropper = this.selectComponent("#image-cropper");
		this.uploadApi()
	},
	uploadApi(){
		var that =this;
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				console.log(res)
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				const size = res.tempFiles[0].size
				if(size > 3000*1000){
					app.showMsg('图片不能超过3M');
					return false;
				}
				that.setData({
					src:tempFilePaths,
				});
			},
			fail(res){
				console.log('取消选择')
				wx.navigateBack({
				  delta: 1
				})
			}
		})
	},
	cropperload(e){
		console.log("cropper初始化完成");
	},
	loadimage(e){
		//重置图片角度、缩放、位置
		this.cropper.imgReset();
	},
	clickcut(e) {
		console.log(e.detail);
		//点击裁剪框阅览图片
		wx.previewImage({
			current: e.detail.url, // 当前显示图片的http链接
			urls: [e.detail.url] // 需要预览的图片http链接列表
		})
	},
	cancelUpload(){
		wx.navigateBack({
		  delta: 1
		})
	},
	chooseUpload(){
		this.uploadApi()
	},
	okUpload(){
		var that = this
		var header = req.getHeaderForUpload();
		var index = this.data.imgIndex
		if(index == 'my_head_img_1') index = 1;
		if(index == 'my_head_img_2') index = 2;
		if(index == 'my_head_img_3') index = 3;
		this.cropper.getImg((data)=>{
			console.log(data.url)
			app.loadTitle('正在上传...')
			wx.uploadFile({
				url: that.data.apiUrl+'/back/upload/upload-file', 
				filePath: data.url,
				formData:{'uploadType':that.data.uploadType,'imgIndex':index},
				name: 'file', 
				header:header,
				success (res){
					const data = JSON.parse(res.data).data
					if(data.status == 200){
						console.log('开始更新信息')
						user.setUserInfoByUnionId()
						app.hideLoad()
						app.showMsg('上传成功');
						//返回上层并传值
						const eventChannel = that.getOpenerEventChannel()
						eventChannel.emit('imgIndex', {data: data.url,type:that.data.imgIndex});
						wx.navigateBack({
						  delta: 1
						})
						
					}
				}
			})
		})
	}
})