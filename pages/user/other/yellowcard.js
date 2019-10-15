var userFunc = require('../../../common/user.js');
var req = require('../../../common/request.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
	data: {
		loading: 0,
		list:[]
	},
	onLoad() {
		this.getYellowCard()
	},
	//获取所有的黄牌记录
	getYellowCard() {
		var that = this
		if(this.data.loading){
			return false;
		}
		this.setData({
			loading:1
		})
		req.getYellowCard().then((res)=>{
			console.log(res.data.data)
			if(res.data.status == 1){
				that.setData({
					list:res.data.data,
					loading:0
				})
			}
		})
	}
})
