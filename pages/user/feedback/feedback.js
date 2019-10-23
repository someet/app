var req = require('../../../common/request.js');
var util = require('../../../utils/util.js');
var app = getApp()
Page({
	data: {
		id: 0,
		goodUser: 0,
		badUser: 0,
		goodUnselect: [],
		badUnselect: [],
		act: [],
		badReason: [{
			id: 1,
			reason: [{
					'title': '活动文案夸大了实际效果',
					'checked': false,
					'id': 1
				},
				{
					'title': '活动具体执行效果没有达到预期',
					'checked': false,
					'id': 2
				},
				{
					'title': '活动流程有变动，没有提前跟用户沟通',
					'checked': false,
					'id': 3
				},
				{
					'title': '活动文案和实际内容不是一回事',
					'checked': false,
					'id': 4
				},
			],
			title: "活动与预期不符"
		}],
		selectReason: false,
		showDetail: false,
		selectedBadId: [], //已经选择的不好的理由,
		currentBadId:[],
		currentBadIndex:[],//当前选择的不满意的理由索引
		allbadReason:[],
		actRecordsTotal:10,
		founderRecordsTotal:10,
		actRecords:'',
		founderRecords:'',
		isClick:false,
		feedback:'',
		feedbackSrc:''
	},
	onLoad() {
		var that = this
		// actInfo
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('actInfo', function(data) {
			console.log(data)
			that.setData({
				id: data.id,
			})
		});
		console.log(this.data.badReason)
		this.getAnswers()
		this.getBadReason()
	},
	changeFounderRecords(e){
		var val = e.currentTarget.dataset.val
		this.setData({
			founderRecords:val,
			isClick:true
		})
	},
	changeActRecords(e){
		var val = e.currentTarget.dataset.val
		this.setData({
			actRecords:val,
			isClick:true
		})
	},
	//获取所有坏理由
	getBadReason() {
		var that = this
		var data = {
			id: this.data.id
		}
		req.getBadReason(data).then((res) => {
			console.log(res) //
			//设置数据
			that.setData({
				badReason: res.data.data
			})

		})
	},
	checkboxChange(e) {
		var index = e.currentTarget.dataset.index
		console.log(index)
		var selectReason = this.data.selectReason
		var reason = selectReason.reason
		reason[index].checked = !reason[index].checked
		selectReason.reason = reason
		this.setData({
			selectReason: selectReason,
		})
	},
	//点击不好的理由
	selectReason(e) {
		var index = e.currentTarget.dataset.index
		var id = e.currentTarget.dataset.id
		var badReason = this.data.badReason[index]
		var allReason = this.data.badReason
		allReason[index].checked = true;
		//检查是否已经插入已选择列表va
		if (this.data.selectedBadId.indexOf(id) == -1) {
			var selectedBadId = this.data.selectedBadId
			selectedBadId.push(id)
			this.setData({
				selectedBadId: selectedBadId
			})
			console.log(this.data.selectedBadId)
		}
		this.setData({
			badReason: allReason,
			selectReason: badReason,
			showDetail: true,
			currentBadIndex:index,
		})
	},
	//获取所有的正常参与的用户
	getAnswers() {
		app.loadTitle('获取报名用户')
		var data = {
			'activity_id': this.data.id,
		}
		var that = this
		req.getFeedBackAnswer(data).then((res) => {
			console.log(res)
			if (res.data.status == 1) {
				var act = res.data.act
				act.time = util.formatTimeSingle(act.start_time) + '-' + util.formatTimeSingle(act.end_time)
				that.setData({
					goodUnselect: res.data.data,
					badUnselect: res.data.data,
					act: act
				})
			}
			app.hideLoad()
		})
	},
	selectGoodUser(e) {
		var selectedId = e.currentTarget.dataset.id
		console.log(selectedId)
		// if (this.data.goodUser != 0) selectedId = 0
		this.setData({
			goodUser: selectedId
		})
	},
	selectBadUser(e) {
		var selectedId = e.currentTarget.dataset.id
		console.log(selectedId)
		this.setData({
			badUser: selectedId,
		})
	},
	//提交理由反馈
	reasonChildSubmit(e) {
		var other_reason = e.detail.value.content
		var res = e.detail.value.badReason
		var currentBadIndex = this.data.currentBadIndex
		var allbadReason = this.data.allbadReason
		allbadReason[currentBadIndex] = new Array();
		for (let [key,row] of res.entries()) {
			var single = row.split('-');
			allbadReason[currentBadIndex].push({
				'id':single[1],
				'pid':single[2],
				'other_reason':other_reason
			})
		}
		this.setData({
			allbadReason:allbadReason
		})
		this.hideDetail()
	},
	hideDetail() {
		this.setData({
			showDetail: false
		})
		// if()
	},
	submitFeedback(){
		var data = {
			good_user:this.data.goodUser,
			bad_user:this.data.badUser,
			badReason:JSON.stringify(this.data.allbadReason),
			actRecords:this.data.actRecords,
			founderRecords:this.data.founderRecords,
			feedback:this.data.feedback,
			activity_id:this.data.id,
			image:this.data.feedbackSrc
		}
		console.log(data)
		var that = this
		console.log(data)
		app.loadTitle('请稍后')
		req.addUserFeedback(data).then((res) => {
			if(res.data.status == 1){
				app.hideLoad()
				app.showMsg(res.data.data)
				wx.redirectTo({
					url:'/pages/user/answer/answer'
				})
			}else{
				app.showMsg(res.data.data)
				that.setData({
					isClick: false
				})
			}
			console.log(res)
		})
	},
	bindinput(e){
		this.setData({
			feedback:e.detail.value
		})
	},
	//监听文本输入
	bindTextAreaBlur(e){
		this.setData({
			feedback:e.detail.value
		})
	},
	uploadImg(){
		var that =this;
		var header = req.getHeaderForUpload();
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
				app.loadTitle('正在上传...')
				wx.uploadFile({
					url: app.globalData.apiUrl+'/back/upload/upload-file', 
					filePath: tempFilePaths[0],
					formData:{'uploadType':'feedback','imgIndex':'0'},
					name: 'file', 
					header:header,
					success (res){
						const data = JSON.parse(res.data).data
						if(data.status == 200){
							app.hideLoad()
							app.showMsg('上传成功');
							//返回上层并传值
							that.setData({
								feedbackSrc:data.url
							})
							
						}
					}
				})
			},
			fail(res){
			}
		})
	}
})
