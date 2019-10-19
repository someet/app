var req = require('../../../../common/request.js');
var app = getApp()
Page({
	data: {
		id:0
	},
	onLoad(){
		var that = this
		// actInfo
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('actInfo', function(data){
			console.log(data)
		});
	},
	
})