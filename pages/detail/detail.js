var WxParse = require('../wxParse/wxParse.js');
Page({
  data: {
	id:0,
	model:{}
  },
  onLoad: function (options) {
    console.log(options.id)
	var act_id = options.id
	this.setData({
		id:act_id
	})
	this.getDetail();
  },
  onReady:function(){
	
  },
  getDetail:function(){
	  wx.showLoading({
		  title: '加载中',
	  })
	  var that = this;
	  var data = {'id':this.data.id};
	  
	  
	  // -------------
	  var d = {"success":"1","data":{"id":"17869","city_id":"2","city":"北京","type_id":"37","title":"艺术家影响大众，先锋艺术家影响艺术家：左小祖咒作品赏析","desc":"#马也音乐会#Vol.2","poster":"http://img.someet.cc/Fo_ibBE5E3jgf3MBEYHJGdxufjWF","week":"0","start_time":"1553425200","end_time":"1553432400","area":"朝阳公园","address":"丽水嘉园","address_assign":"否","details":"<p><span style=\"text-align: center;\"></span></p><p style=\"text-align: center;\">这是<b>第 2 期</b>音乐会</p><p></p><p></p><p></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">“如果我吻你，你就微笑，我就吻你</p><p style=\"text-align: center;\">小莉啊，谁人敢像我这样对你</p><p style=\"text-align: center;\">他就不怕我打破他的头</p><p style=\"text-align: center;\">但是法律这玩意儿可怕哟”</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">以上这段歌词</p><p style=\"text-align: center;\">来自一位叫<b>左小祖咒</b>的歌手</p><p style=\"text-align: center;\">最广为流传的歌曲之一《小莉》</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\"></p><p><img src=\"http://img.someet.cc/Fg9Jm7gAAMrygTnRob3KLnBKKrGd?imageView2/2/w/800\" style=\"width: 100%;\"></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\"><b>这是我最喜欢的歌词之一</b></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">上周音乐会</p><p style=\"text-align: center;\">我们一共十位朋友</p><p style=\"text-align: center;\">听完了整张<b>《地球最后的夜晚》</b>的原声带</p><p style=\"text-align: center;\">共同经历了一次非常奇妙的体验</p><p style=\"text-align: center;\"><br></p><p><img src=\"http://img.someet.cc/FppI5E9nEg6JXO6Sny6h57jNho7p?imageView2/2/w/800\" style=\"width: 100%;\"></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">结束前，我试探性地播放了左小祖咒的一首新歌</p><p style=\"text-align: center;\">是他最新发布的四张新专辑里第二张里的第二首</p><p style=\"text-align: center;\">在这支长达 18 分钟的<b>民谣/实验/交响/电子/摇滚/史诗</b>里</p><p style=\"text-align: center;\">我几乎窥见这位地下音乐教父<b>在音乐上的全部野心</b></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">当然，不出意外</p><p style=\"text-align: center;\">在听到一分钟左右的时候</p><p style=\"text-align: center;\">我看到大家脸上<b>实在无法继续忍受</b>的表情</p><p style=\"text-align: center;\">就关了</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">这大概是大多数人对他的体会和印象</p><p style=\"text-align: center;\">所以这周，我自杀式地想举办这场左小祖咒作品赏析会</p><p style=\"text-align: center;\">同时也因为，他确实是<b>我最爱的音乐艺术家之一</b></p><p style=\"text-align: center;\"><b><br></b></p><p><img src=\"http://img.someet.cc/Fu4eEnYIyensHb1Cl3kn3AkT07HN?imageView2/2/w/800\" style=\"width: 100%;\"></p><p></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">在这周，你会听到我节选出的他不同阶段的作品</p><p style=\"text-align: center;\">包括但不限于：</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">NO 乐队时期的<b>迷幻、实验与对奇异音色的追索</b></p><p style=\"text-align: center;\">连续数张<b>史上最昂贵专辑</b>期间的代表作</p><p style=\"text-align: center;\">与<b>不方便透露姓名</b>的某位艺术家的合作</p><p style=\"text-align: center;\">与方便透露姓名、但<b>全部作品已被下架</b>的陈升的合作</p><p style=\"text-align: center;\">将原作气质一笔勾销、与黄渤合作的<b>《一剪梅》</b></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\">近年来参与制作的<b>电影配乐</b>、主题曲</p><p style=\"text-align: center;\">以及<b>本月发布</b><b>的</b>最新专辑</p><p style=\"text-align: center;\"><br></p><p><img src=\"http://img.someet.cc/FgGQBPRn8CEsIefqiKOrG2KBdKu4?imageView2/2/w/800\" style=\"width: 100%;\"></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">希望遇到资深的左小乐迷</p><p style=\"text-align: center;\">我想听到你的观点与分析</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">与此同时，无论你是否喜欢左小祖咒</p><p style=\"text-align: center;\">是否听过他的任何作品</p><p style=\"text-align: center;\">我也希望你能来试试看</p><p style=\"text-align: center;\"><b>跳出舒适区</b>，我想了解你的视角和情绪</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">以及，我们来聊聊<b>「难听」</b>这件事</p><p style=\"text-align: center;\"></p><p><br></p><p></p><p><img src=\"http://img.someet.cc/Fsmk8ruGqMXrKVLMnUE8h-scA0uC?imageView2/2/w/800\" style=\"width: 100%;\"></p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">为此，我准备了可能是<b>最好的单体音箱</b>&nbsp;BeoPlay A9</p><p style=\"text-align: center;\">作为我们的播放设备</p><p style=\"text-align: center;\">（此处没有植入</p><p style=\"text-align: center;\"><br></p><p style=\"text-align: center;\">本周日晚七点</p><p style=\"text-align: center;\">欢迎你来我的客厅aka<b>朝阳公园文艺壁垒</b></p><p style=\"text-align: center;\">等你来飞</p><p style=\"text-align: center;\"><br></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p style=\"text-align: center;\">往期活动图：</p><p><img src=\"http://img.someet.cc/FlF2GBadeQ5Xzc68Y6UyJw-W3zbk?imageView2/2/w/800\" style=\"width: 100%;\"></p><p></p><p></p><p></p><p style=\"text-align: center;\"></p><p style=\"text-align: center;\"></p><p><img src=\"http://img.someet.cc/FppI5E9nEg6JXO6Sny6h57jNho7p?imageView2/2/w/800\" style=\"width: 100%;\"></p><p style=\"text-align: center;\">场地环境图：<br></p><p><img src=\"http://img.someet.cc/FnURg6kIgWOvNVm6dEzjP0VqiAsX?imageView2/2/w/800\" style=\"width: 100%;\"></p><p><img src=\"http://img.someet.cc/FpUQARtNpPpScqWwD4SHVLCra-Pc?imageView2/2/w/800\" style=\"width: 100%;\"></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>","group_code":"http://img.someet.cc/FlSeFZhQ7mIC-2hoIl78kuYQlRoq","longitude":"116.483756","latitude":"39.932549","cost":"60","cost_list":"场地、设备、活动费用","peoples":"20","ideal_number":"10","ideal_number_limit":"12","is_volume":"0","is_digest":"0","is_top":"1","principal":"0","pma_type":"0","review":"<p><span id=\"selectionBoundary_1533625055001_34785148209404393\">﻿</span>1、破冰，自我介绍；</p><p>2、开始听歌；</p><p>3、随听随聊，发散讨论；</p><p>4、合影留念，尽情勾搭。</p>","created_at":"1552889887","created_by":"285","updated_at":"1553066374","updated_by":"2961","status":"20","edit_status":"0","display_order":"99","content":"艺术家影响大众，先锋艺术家影响艺术家：左小祖咒作品赏析#马也音乐会#Vol.2","apply_rate":"20","field1":null,"field2":"<p></p><p><span id=\"selectionBoundary_1533114092400_2005812930131725\">﻿</span>1、<span id=\"selectionBoundary_1533114086163_14883664449115686\">﻿</span>活动不允许空降，如果有同行的小伙伴请把活动分享给TA让TA自行报名哟；​</p><p>2<span id=\"selectionBoundary_1533114087786_7814948446687555\">﻿</span>、活动若无法照常参加，请进入Someet服务平台（ID：SomeetInc）中的个人界面自行请假，否则将视为爽约（活动开始时间24小时以上请假将获一张黄牌，24小时内请假两张黄牌，临时爽约3张黄牌）；</p><p>3<span id=\"selectionBoundary_1533114089476_41789195498004617\">﻿</span>、用户报名收费活动并通过筛选后，于24小时内交费后可以看到活动群二维码，否则将被自动记录为请假，无法参加活动；由于活动名额是宝贵并且有限的，参与者的请假一定程度上会影响发起人以及其他小伙伴的活动体验，以及发起人的成本开支，甚至导致活动的无法进行，所以Someet官方设置以下机制：活动开始前提前一天请假，得到1张黄牌，仅退还您支付活动费用中的50%；活动开始前不足一天内请假得到2张黄牌，很遗憾，我们不退还您任何费用。<span id=\"selectionBoundary_1533625075760_6508120381437548\" class=\"rangySelectionBoundary\">﻿</span></p><p></p><p></p><p></p><p></p><p></p><p></p>","field3":null,"field4":"0,null,null","field5":"1","field6":"<p><span id=\"selectionBoundary_1533114076937_29058893171652445\" class=\"rangySelectionBoundary\">﻿</span>收到活动报名通知后记得及时付款扫码进群<span id=\"selectionBoundary_1533114074935_4208849576436391\" class=\"rangySelectionBoundary\">﻿</span></p>","field7":"","field8":"","co_founder1":"0","co_founder2":"0","co_founder3":"0","co_founder4":"0","is_full":"0","join_people_count":"2","space_spot_id":"0","sequence_id":"1","version_number":"0","group_id":"0","is_display":"1","allow_vip":"0","want_allow_vip":"0","is_rfounder":"0","reject_reason":"undefined","tag_id":"12","act_tag_id":null,"district":"0","detail_header":"$$$$","first_publish_date":"1552977852","cancel_reason":null,"push_check_time":"1552968252","update_groupCode_time":"1553066374","collect_num":"0","is_recommend":"0","is_set_question":"0","is_prevent_push":null,"is_push_on":"1","is_new":"0","type":{"id":"37","icon_img":"http://img.someet.cc/Fm7LIQ3us_5dNEPKLY1qeFjaIkQr","name":"音乐舞蹈"},"is_collect":0,"is_black":null},"status_code":200}
	  var detail = d.data
	  WxParse.wxParse('content', 'html', detail.details, that,0);
	  that.setData({
	  	model:detail
	  }),
	  wx.hideLoading()
	  
	  // --------------
	  
// 	  return false;
// 	  wx.request({
// 	  	url:'http://dubin.ngrok.wdevelop.cn/v1/activity/view',
// 		data:data,
// 		success:function(res){
// 			var detail = res.data.data;
// 			WxParse.wxParse('content', 'html', detail.details, that,0);
// 			that.setData({
// 				model:detail
// 			}),
// 			wx.hideLoading()
// 		}
// 	  })
  }
})