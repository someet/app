var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		id:0,
		tagType:1,
		selectTags:{},
		selectTagsId:[],
		unselectTags:{},
		unSelectTagsId:[]
	},
	onLoad(options){
		const that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('tagType', function(data){
			console.log(data)
			that.setData({
				tagType:data.data
			})
		});
		this.getMyTags()
	},
	confirmSub(){
		//返回上层并传值
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.emit('imgIndex', {data: '123',type:'zy'});
		wx.navigateBack({
		  delta: 1
		})
	},
	// 自己添加标签
	subTags(){
		console.log('上传了')
		var e = {
			currentTarget:{
				dataset:{
					id:222,
					title:'嘿嘿'
				}
			}
		}
		this.selectTag(e)
	},
	// 选择完成并返回
	saveAndBack(){
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.emit('tagType',{data:'1111'});
	},
	// 获取单个分类标签的选取和未选取的标签
	getMyTags(){
		const that = this
		req.getMyTags(this.data.tagType).then((res)=>{
			console.log(res.data.data)
			that.setData({
				selectTags:res.data.data.selectTags,
				unselectTags:res.data.data.unselectTags
			})
			var unSelectTagsId = [], selectTagsId = [];
			for (let val in res.data.data.selectTags) {
				selectTagsId.push(val.id)
			}
			for (let val in res.data.data.unSelectTags) {
				unSelectTagsId.push(val.id)
			}
		})
	},
	// 点击已选择的按钮
	unselectTag(e){
		console.log('已除选择项')
		this.removeTags(e.currentTarget.dataset);
	},
	// 点击未选择的分类
	selectTag(e){
		console.log('未除选择项')
		if(this.data.tagType == 1){
			if(this.data.selectTags.length >=3){
				app.showMsg('最多选三个')
				return false;
			}
		}
		this.addTags(e.currentTarget.dataset);
	},
	// 增加未选择的标签
	addTags(obj){
		console.log(obj)
		var selectTags,unselectTags,selectTagsId,unSelectTagsId;
		selectTags = this.data.selectTags
		selectTagsId = this.data.selectTagsId
		unSelectTagsId = this.data.unSelectTagsId
		unselectTags = this.data.unselectTags
		//删除选择的分类
		for (var [key,val] of unselectTags.entries()) {
			if(val.id == obj.id){
				unselectTags.splice(key,1);
				//查询已选择的分类id
				if(unSelectTagsId.indexOf(obj.id) != -1){
					unselectTagsId.splice(unSelectTagsId.indexOf(obj.id),1)
				}
			}
		}
		if(selectTagsId.indexOf(obj.id) == -1){
			selectTagsId = [...this.data.selectTagsId,obj.id]
			selectTags = [...this.data.selectTags,{
				id:obj.id,
				tag_title:obj.title
			}]
		}
		this.setData({
			selectTags:selectTags,
			unselectTags:unselectTags
		})
	},
	// 移除选择的标签
	removeTags(obj){
		var selectTags,unselectTags,selectTagsId,unSelectTagsId;
		selectTags = this.data.selectTags
		selectTagsId = this.data.selectTagsId
		unSelectTagsId = this.data.unSelectTagsId
		unselectTags = this.data.unselectTags
		// 把元素从已选择列表中移除
		for (var [key,val] of selectTags.entries()) {
			if(val.id == obj.id){
				selectTags.splice(key,1);
				//查询已选择的分类id
				if(selectTags.indexOf(obj.id) != -1){
					selectTags.splice(selectTags.indexOf(obj.id),1)
				}
			}
		}
		if(unSelectTagsId.indexOf(obj.id) == -1){
			unSelectTagsId = [...this.data.unSelectTagsId,obj.id]
			// 增加未选择列表
			unselectTags = [...this.data.unselectTags,{
				id:obj.id,
				title:obj.title	
			}]
		}
		this.setData({
			selectTags:selectTags,
			unselectTags:unselectTags
		})
	}
})