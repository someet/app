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
		// yellowcard
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
	},
	//去申诉
	goAppeal(e){
		var index = e.currentTarget.dataset.index,that = this
		var item = this.data.list[index]
		wx.navigateTo({
			url:'/pages/user/other/appeal',
			events:{
				yellowcard(data){
					console.log(data)
					//更改状态吧、、v
					var listData = that.data.list
					for (let [index,val] of listData.entries()) {
						if(listData[index].id == data.data.id){
							listData[index].appeal_status = data.data.appeal_status
							break;
						}
					}
					that.setData({
						list:listData
					})
				}
			},
			success(res){
				res.eventChannel.emit('yellowcard',{data:item})
			}
		})
	}
})
