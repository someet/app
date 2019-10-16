var userFunc = require('../../../common/user.js');
var req = require('../../../common/request.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
	data: {
		loading: 0,
		detail:[],
		disableTime:0,
	},
	onLoad() {
		// yellowcard
		const eventChannel = this.getOpenerEventChannel(),that = this
		eventChannel.on('yellowcard', function(data){
			console.log(data)
			var t = data.data.created_at
			that.setData({
				detail:data.data,
				disableTime:util.formatTimeSingle(Number(t)+Number(259200))
			})
		});
	},
	//提交申诉
	appealSubmit(e){
		app.loadTitle('正在提交')
		console.log(e.detail.value)
		var data = e.detail.value,that = this
		const eventChannel = that.getOpenerEventChannel()
		req.submitAppeal(data).then((res)=>{
			console.log(res.data)
			if(res.data.status == 1){
				app.hideLoad()
				console.log('21312312312312')
				eventChannel.emit('yellowcard', {'data':res.data.data});
				wx.navigateBack({
					delta: 1
				})
			}
		})
	}
})
