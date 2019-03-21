// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	isActive:{
		type:String,
		value:'act'
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	
  },
  /**
   * 组件的方法列表
   */
  methods: {
	swichTo:function(e){
		var action = e.currentTarget.dataset['action'];
		var routers = getCurrentPages().route;
		if(action == 'act' && routers !== 'pages/index/index'){
			wx.switchTab({
				url:'../index/index'
			})
		}else if(action == 'map' && routers !== 'pages/index/index'){
			wx.switchTab({
				url:'../map/map'
			})
		}else if(action == 'user' && routers !== 'pages/user/user'){
			wx.switchTab({
				url:'../user/user'
			})
		}
	}
  }
})