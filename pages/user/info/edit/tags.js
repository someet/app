var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js');
var app = getApp()
Page({
	data: {
		id: 0,
		tagType: 1,
		type_pid: 0,
		selectTags: {},
		selectTagsId: [],
		unSelectTags: {},
		unSelectTagsId: [],
		myTag: '',
	},
	onLoad(options) {
		const that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('tagType', function(data) {
			that.setData({
				tagType: data.data
			})
		});
		this.getMyTags()
	},
	// 自己添加标签
	subTags(e) {
		const val = e.detail.value.myTag;
		var that = this
		if (!val) {
			app.showMsg('请输入标签')
			return false;
		}
		const data = {
			type_id: this.data.tagType,
			type_pid: this.data.type_pid,
			val: val
		}
		app.loadTitle('正在添加')
		//添加自己的标签入库
		req.addMyTga(data).then((res) => {
			app.hideLoad()
			const data = res.data.data
			if (data.status == 1) {
				const obj = {
					currentTarget: {
						dataset: {
							id: data.id,
							title: data.title
						}
					}
				}
				that.selectTag(obj)
				// 清除刚刚添加input 的值
				that.setData({
					myTag: ''
				})
			} else {
				app.showMsg(data.msg)
			}
		})

	},
	// 选择完成并返回
	saveAndBack() {
		//保存所选择的标签
		//获取我选择的标签
		var that = this;
		var selectTagsId = this.data.selectTagsId
		var tags = wx.getStorageSync('userInfo').tags
		console.log(selectTagsId)
		req.saveTags(selectTagsId, this.data.tagType).then((res) => {
			console.log(res)
			console.log(res.data);
			if (res.data.status == 1) {
				if (that.data.tagType != 6 && (tags.length == 0)) {
					var tagType = ++that.data.tagType
					that.setData({
						tagType: tagType
					})
					console.log(that.data.tagType, '++++++++', tagType)
					that.getMyTags()
				} else {
					user.setUserInfoByUnionId()
					req.checkUserInfoComplete().then((res) => {
						console.log('12312进来了')
						console.log(res)
						var data = res.data;
						if (data.status == 0) {
							var userInfoComplete = data.type
							if (userInfoComplete == 'complete') {
								// 检查是否是从活动报名过lai/
								var userFrom = wx.getStorageSync('editUserFrom')
								if (userFrom.fromPage == 'act') {
									//跳转到活动页面之前删除保存的from 信息
									wx.removeStorageSync('editFrom')
									wx.redirectTo({
										url: '/pages/details/detail?id=' + userFrom.id
									})
								}
							} else if (userInfoComplete == 'tags') {
								// 跳转到填写标签页面,从第一页开始
								wx.navigateTo({
									url: '/pages/user/info/edit/tags',
									events: {},
									success(res) {
										res.eventChannel.emit('tagType', {
											data: 1,
											'method': 1
										})
									}
								})
							} else if (userInfoComplete == 'uga') {
								// 跳转到填写uga 的页面从第一条开始
								var id = 0
								var type = 'add'
								var that = this
								wx.navigateTo({
									url: '/pages/user/info/edit/addUga',
									events: {},
									success(res) {
										res.eventChannel.emit('editUgaIndex', {
											'type': type,
											'id': id
										})
									}
								})
							} else {
								wx.navigateTo({
									url: '/pages/user/info/edit/edit'
								})
							}
						} else {
							wx.redirectTo({
								url: '/pages/user/info/edit/edit'
							})
						}
					})
				}
			}
		})

	},
	// 获取单个分类标签的选取和未选取的标签
	getMyTags() {
		app.loadTitle('正在获取数据')
		const that = this
		req.getMyTags(this.data.tagType).then((res) => {
			const data = res.data.data;
			console.log(data)
			var unSelectTagsId = [],
				selectTagsId = [];
			for (let val in data.selectTags) {
				selectTagsId.push(data.selectTags[val].tag_id)
			}
			for (let val in data.unSelectTags) {
				unSelectTagsId.push(data.unSelectTags[val].tag_id)
			}
			that.setData({
				selectTags: data.selectTags,
				unSelectTags: data.unSelectTags,
				type_pid: data.type_pid,
				selectTagsId: selectTagsId,
				unSelectTagsId: unSelectTagsId
			})
			app.hideLoad();
		})
	},
	// 点击已选择的按钮
	unselectTag(e) {
		this.removeTags(e.currentTarget.dataset);
	},
	// 点击未选择的分类
	selectTag(e) {
		if (this.data.tagType == 1) {
			if (this.data.selectTags.length >= 3) {
				app.showMsg('最多选三个')
				return false;
			}
		}
		this.addTags(e.currentTarget.dataset);
	},
	// 增加未选择的标签
	addTags(obj) {
		console.log(this.data.selectTagsId)
		var selectTags, unSelectTags, selectTagsId, unSelectTagsId;
		selectTags = this.data.selectTags
		selectTagsId = this.data.selectTagsId
		unSelectTagsId = this.data.unSelectTagsId
		unSelectTags = this.data.unSelectTags
		//删除选择的分类
		for (var [key, val] of unSelectTags.entries()) {
			if (val.id == obj.id) {
				unSelectTags.splice(key, 1);
				//查询已选择的分类id
				if (unSelectTagsId.indexOf(obj.id) != -1) {
					unSelectTagsId.splice(unSelectTagsId.indexOf(obj.id), 1)
				}
			}
		}
		if (selectTagsId.indexOf(obj.id) == -1) {
			selectTagsId = [...this.data.selectTagsId, obj.id]
			selectTags = [...this.data.selectTags, {
				id: obj.id,
				tag_title: obj.title
			}]
		}
		this.setData({
			selectTags: selectTags,
			selectTagsId: selectTagsId,
			unSelectTags: unSelectTags
		})
		console.log(this.data.selectTagsId)
	},
	// 移除选择的标签
	removeTags(obj) {
		var selectTags, unSelectTags, selectTagsId, unSelectTagsId;
		selectTags = this.data.selectTags
		selectTagsId = this.data.selectTagsId
		unSelectTagsId = this.data.unSelectTagsId
		unSelectTags = this.data.unSelectTags
		// 把元素从已选择列表中移除
		for (var [key, val] of selectTags.entries()) {
			if (val.tag_id == obj.id) {
				selectTags.splice(key, 1);
				//查询已选择的分类id
				if (selectTagsId.indexOf(obj.id) != -1) {
					selectTagsId.splice(selectTagsId.indexOf(obj.id), 1)
				}
			}
		}
		if (unSelectTagsId.indexOf(obj.id) == -1) {
			unSelectTagsId = [...this.data.unSelectTagsId, obj.id]
			// 增加未选择列表
			unSelectTags = [...this.data.unSelectTags, {
				id: obj.id,
				title: obj.title
			}]
		}
		this.setData({
			selectTags: selectTags,
			unSelectTags: unSelectTags,
			unSelectTagsId: unSelectTagsId
		})
		console.log(this.data.selectTagsId)
	}
})
