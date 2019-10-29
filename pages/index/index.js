//index.js
//获取应用实例
var req = require('../../common/request.js');
const app = getApp()
Page({
	data: {
		'indicatorDots': false,
		'autoplay': true,
		'interval': 3000,
		'duration': 500,
		'imgUrls': [
			'http://img.someet.cc/Fu1BA7sYzNOBthutKHLoy_6CONJn?imageView2/2/w/800',
			'http://img.someet.cc/Fsf90kgFc9LRudmZWLnEWgaf33eF?imageView2/2/w/800',
			'http://img.someet.cc/Fifvzz8TD4kIxd9Ycv9_7gsC6IOt?imageView2/2/w/800'
		],
		'currentData': 'activity',
		'toView': 'bottomView',
		'scrollHeight': 0,
		bannerHeight: 0,
		'demoPoster': 'http://img.someet.cc/FoY3zO1zhLa4bxwFHmsl_plUDP6z',
		'actList': [],
		'isActStart': 1,
		'city': 2,
		'page': 1,
		'search': '',
		limit: 5,
		pageTotal: 2
	},
	onLoad: function(options) {
		var city = typeof(options.city_id) == undefined ? 2 : options.city_id
		this.setData({
			city: city
		})
		var client = wx.getSystemInfoSync();
		console.log(client)
		var clientWidth = client.windowWidth;
		var clientHeight = client.windowHeight;
		var radio = 355 / 800;
		var bannerHeigtht = clientWidth * radio;
		this.setData({
			bannerHeight: bannerHeigtht + 'px',
			scrollHeight: clientHeight + 100
		})
		var that = this
		//请求数据
		var list = that.getActList();

	},
	searchAct() {
		wx.showToast({
			title: '还没做，先等着吧',
			icon: 'none',
			duration: 2000
		})
	},
	//点击切换，滑块index赋值
	checkCurrent: function(e) {
		const that = this;
		this.setData({
			currentData: e.target.dataset.current
		})
	},
	//获取活动数据
	getActList() {
		console.log('获取列表')
		// -------------- 

		// var data = {"success":"1","data":[{"title":"用2小时缓解1周工作压力：在音乐中调频身心","poster":"http://img.someet.cc/FnBOGfXWZ7_yfZm_rn1fs9MNY2Cs","desc":"#音乐减压工作坊#","id":"17909","type_id":"46","status":"20","is_full":"0","display_order":"99","apply_rate":"5","is_top":"1","city_id":"2","type":{"id":"46","status":"10","name":"职场&心理","img":"http://img.someet.cc/FkHdUTdGuiDbSeeJ3kF8KWoDmTpV"}},{"title":"乐手征集令！组个乐队其实没这么难！","poster":"http://img.someet.cc/FlpAnn3vD3OxymlEpLGW8Eoffh1Y","desc":"挑战！三个小时组个“临时”乐队 Vol.5","id":"17867","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"14","is_top":"1","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"艺术家影响大众，先锋艺术家影响艺术家：左小祖咒作品赏析","poster":"http://img.someet.cc/Fo_ibBE5E3jgf3MBEYHJGdxufjWF","desc":"#马也音乐会#Vol.2","id":"17869","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"20","is_top":"1","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"夜访城市角落：春日爵士小组","poster":"http://img.someet.cc/FoY3zO1zhLa4bxwFHmsl_plUDP6z","desc":"#周末音乐会#","id":"17891","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"30","is_top":"1","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"印象主义音乐赏析，聆听音乐中的色彩","poster":"http://img.someet.cc/FjJ1f13bNV83WpZYecdx2gKK5ZdX","desc":"中医手作沙龙","id":"17931","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"唐诗的正确打开方式，一起来读《六神磊磊读唐诗》","poster":"http://img.someet.cc/FlQF_KZGf0NTKCm7anOp71R0N8dE","desc":"中医手作沙龙","id":"17929","type_id":"41","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"41","status":"10","name":"阅读&科普","img":"http://img.someet.cc/FndqvMo5QOIvlyDy6gNmLSYXLmKS"}},{"title":"跟着霸气摇滚仙女，面对面high翻架子鼓，跟着节奏燥起来吧","poster":"http://img.someet.cc/FlNU1XnmqjvP9mk3pNqga3JOInZD","desc":"Vol.11","id":"17928","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"不做衣服的奴隶，陪你去商场来一次私人定制搭配之旅","poster":"http://img.someet.cc/Fuv2S-5pOLqzWjqPc4pBdo788Suq","desc":"Vol.49","id":"17926","type_id":"42","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"42","status":"10","name":"艺术&实验","img":"http://img.someet.cc/FvPRE0gtBMA0f-f6IFDTHuS5WvLC"}},{"title":"冬去春来，如何做一名合格的家庭医生？","poster":"http://img.someet.cc/Fv8IKJe-8RWDctRFXiu-pU_HIf6D","desc":"中医手作沙龙","id":"17923","type_id":"45","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"45","status":"10","name":"主题聊天","img":"http://img.someet.cc/FhoJsh4REmgtpCPGgf_LUlKRXlZe"}},{"title":"者来：发现你身上最独特的乐器 | Dimo × 耳根硬Lab","poster":"http://img.someet.cc/FrhWwEBE26zF513ZZwjTe6z0255m","desc":"探索神奇的乐器“嗓子”","id":"17922","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"搏击，遇到更好的自己——Kickboxing","poster":"http://img.someet.cc/FulQYq9MSziJgExuKkaUZi3DXyGb","desc":"Vol.38","id":"17920","type_id":"40","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"40","status":"10","name":"运动健身","img":"http://img.someet.cc/FgnK17-4nB2dO-nqsO_HNg-OsHk_"}},{"title":"“都挺好”的我们，一！点！都！不！好！","poster":"http://img.someet.cc/FirXR9bUoEyYnAO9gxxfiVhJY9rk","desc":"#即兴表演工作坊招募#","id":"17919","type_id":"42","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"42","status":"10","name":"艺术&实验","img":"http://img.someet.cc/FvPRE0gtBMA0f-f6IFDTHuS5WvLC"}},{"title":"「超能对决」真人互动RPG游戏，化身现实世界的超级英雄","poster":"http://img.someet.cc/Ftkw7lCBC7nfrDQ7IA_qfNInML3t","desc":"中医手作沙龙","id":"17917","type_id":"38","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"38","status":"10","name":"真人游戏&桌游","img":"http://img.someet.cc/FsscLyaDYRsM7D2Fn8DDeO6pm2Be"}},{"title":"从第一个Midi音符开始，看我如何用电脑制作一首歌曲","poster":"http://img.someet.cc/FhPSO9pj9jLjbJESrjvw587EErbV","desc":"中医手作沙龙","id":"17916","type_id":"37","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"37","status":"10","name":"音乐舞蹈","img":"http://img.someet.cc/Fqq6NY_x_WTQo3JAVlRFHyCXa-9V"}},{"title":"BA第一趴：你还苦恼枯燥的社交吗？在这里找到你的CP","poster":"http://img.someet.cc/FiA6yZzNcIQmMByOPXmmnJeFNV3b","desc":"用运动激发你的荷尔蒙","id":"17914","type_id":"40","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"40","status":"10","name":"运动健身","img":"http://img.someet.cc/FgnK17-4nB2dO-nqsO_HNg-OsHk_"}},{"title":"七步通心之旅——沟通癌患者专享","poster":"http://img.someet.cc/FqEjAOcXzsl_aQU97AY12zoB8nym","desc":"中医手作沙龙","id":"17912","type_id":"46","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"46","status":"10","name":"职场&心理","img":"http://img.someet.cc/FkHdUTdGuiDbSeeJ3kF8KWoDmTpV"}},{"title":"野生剧场 < 第一幕：是不是有人真的能懂我 >","poster":"http://img.someet.cc/FkhOt1gaNltkYx3TGXR9rv5SGby8","desc":"中医手作沙龙","id":"17899","type_id":"42","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"42","status":"10","name":"艺术&实验","img":"http://img.someet.cc/FvPRE0gtBMA0f-f6IFDTHuS5WvLC"}},{"title":"看桃花的最好季节已到，徒步穿越鹞子峪野长城，错过要等一年哦","poster":"http://img.someet.cc/FsjXzVd2_-9hXyxJmLotTMXSESAL","desc":"中医手作沙龙","id":"17898","type_id":"39","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"39","status":"10","name":"户外极限&城市探索","img":"http://img.someet.cc/Fp2DGDp4GU4yN247ITnts1lcRPrj"}},{"title":"边喝咖啡，一边画幅春天~","poster":"http://img.someet.cc/FivhNh3FrhSstn2pqBCnK7y8p2sq","desc":"#咖啡伴画侣# Vol.41","id":"17895","type_id":"44","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"44","status":"10","name":"书法绘画","img":"http://img.someet.cc/Fr3CDYxPRIYuWh7Ybv0p8VafZ3NI"}},{"title":"星座小误区，谁说30后看上升星座","poster":"http://img.someet.cc/Ft-mXEmJo0aw4MCObESYhKhccqmi","desc":"占星学科普","id":"17889","type_id":"46","status":"20","is_full":"0","display_order":"99","apply_rate":"0","is_top":"0","city_id":"2","type":{"id":"46","status":"10","name":"职场&心理","img":"http://img.someet.cc/FkHdUTdGuiDbSeeJ3kF8KWoDmTpV"}}],"status_code":200}
		// this.setData({
		// 	'actList':data.data,
		// 	'msg':data
		// })

		// ------------


		// 		return false;
		var that = this;
		app.loadTitle('正在加载')
		var data = {
			'page': that.data.page,
			'search': that.data.search,
			'city': that.data.city,
			'limit': that.data.limit
		}
		if (this.data.pageTotal == this.data.page) {
			app.showMsg('没有了')
			return false;
		}
		req.getIndexList(data).then((res) => {
			app.hideLoad()
			if (res.data.status == 1) {
				var data = that.data.actList
				Array.prototype.push.apply(data, res.data.data)
				that.setData({
					'actList': data,
					isActStart: 1,
					page: ++that.data.page,
					pageTotal: res.data.pageTotal
				})
			} else {
				app.showMsg('周二开启活动报名哦')
				that.setData({
					isActStart: 0
				})
			}
		})
	}
	//跳转页面
	// 	gotDetail:function(e){
	// 		var id = e.target.dataset.aid;
	// 		wx.navigateTo({
	// 			url:'/pages/detail/detail?id='+id
	// 		})
	// 	}
})
