<template>
	<div class="pay">
		<header class='main-header'>
		    <h1 class="main-title">
		        <!--<img id="mchLogo" class="mchLogo" src="./shop-icon.png">-->
		        <img id="mchLogo" class="mchLogo" :src="mchLogo">
		    </h1>
		    <p class='main-sub-title' id="mchNm">{{mchNm}}</p>
		</header>
		<div class="main-panel">
		    <div class="main-con">
		        <label>金额：</label>
		        <!--<div style="float: right; text-align: right">¥-->
		        <!--</div>-->
		        <input id="input-money" @fuous="preventKeyBoard" class="weui-input main-input" :value="payPrice" type="text"  maxlength="9" readonly autofocus/>
		        <input type="text" id="per" style="display:none">
		        <input type="text" id="text1" style="display:none">
		    </div>
		    <a id="addRemarks" v-show="remarkText.length==0" @click="addRemark" class="main-tip">添加备注</a>
		    <span class="pay-coupon" @click="showCoupon">-￥{{couponPrice/100}}(可用优惠券{{couponsList.length}}张)</span>
		    <label v-show="remarkText.length>0" class="remarks">{{remarkText.length>6?remarkText.substring(0,6)+'...':remarkText}}</label>
		    <a v-show="remarkText.length>0" id="updateRemarks" @click="addRemark" class="main-tip">修改</a>
		</div>
		<footer class="main-footer">
		    <p>由富友收件宝提供技术支持</p>
		    <!--<p>由富友收件宝<img src="images/fuiou.png" style="height: 20px">提供技术支持</p>-->
		    <table class="main-table" width="100%" border="0" cellspacing="0" cellpadding="0">
		        <tr>
		            <td @click="inputNum('1')" width="25%" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="1">1</a></td>
		            <td @click="inputNum('2')" width="25%" class="border-bottom0 border-right0"><a class="number" data-values="2">2</a></td>
		            <td @click="inputNum('3')" width="25%" class="border-bottom0 border-right0"><a class="number" data-values="3">3</a></td>
		            <td @click="delInput" class="border-right0 border-bottom0 border-right0"><a id="del" class="del">←</a></td>
		        </tr>
		        <tr>
		            <td @click="inputNum('4')" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="4">4</a></td>
		            <td @click="inputNum('5')" class="border-bottom0 border-right0"><a class="number" data-values="5">5</a></td>
		            <td @click="inputNum('6')" class="border-bottom0 border-right0"><a class="number" data-values="6">6</a></td>
		            <td @click="goToPay" class="border-right0" rowspan="3" id="pay" :class="{pay:payFlag}"><a class="payName" :class="{white:payFlag}" v-html="getPayModeText"></a></td>
		        </tr>
		        <tr>
		            <td @click="inputNum('7')" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="7">7</a></td>
		            <td @click="inputNum('8')" class="border-bottom0 border-right0"><a class="number" data-values="8">8</a></td>
		            <td @click="inputNum('9')" class="border-bottom0 border-right0"><a class="number" data-values="9">9</a></td>
		        </tr>
		        <tr>
		            <td @click="inputNum('0')" class="border-left0 border-right0" colspan="2"><a class="number" data-values="0">0</a></td>
		            <td @click="addDot" class="border-right0"><a class="number" data-values=".">.</a></td>
		        </tr>
		    </table>
		</footer>
		<div id="coupon-wrapper" :class="{active:showCouponFlag}" @click.self="closeCoupon">
			<div class="coupons">
				<div class="title">可用优惠券</div>
				<div class="weui-cells weui-cells_checkbox coupons-content clear">
				  	<label v-for="(item,index,key) in couponsList" @click.self="changeCoupon(item.couponAmt,item.couponAmtMin,item.couponNo)" class="weui-cell weui-check__label" :for="joinId(item.id)" :class='{disabled:!(payPrice*100>=item.couponAmt&&payPrice*100>=item.couponAmtMin)}'>
					    <div class="weui-cell__hd">
					      	<input type="radio" class="weui-check" name="checkbox1" :id="joinId(item.couponNo)" :checked="selectedCouponItemId == item.couponNo">
					      	<i class="weui-icon-checked"></i> 
					    </div>
					    <div class="weui-cell__bd">
					      	<p>{{item.couponNm}}</p>
					    </div>
				  	</label>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  $(function() {
    FastClick.attach(document.body);
  });
</script>
<script>
	//https://static.fuiou.com  静态资源头
	var imgServer = 'https://static.fuiou.com/';
	//import {httpUrl} from '../../../config/http_url';
	import {httpUrl} from '../../assets/js/http_url';
	export default{
		data(){
			return{
				showCouponFlag:false,
				couponsList:[
				],
				couponPrice:0,//优惠价，默认为0,
				remarkText:'',//备注信息
				payPrice:'0',
				//payMode:6,//支付方式 ，0微信支付，6支付宝支付
				payFlag:false,//为ture,按钮显示为绿色背景，为false无背景
				selectedCouponItemId:0,//选中的优惠券列表id
				qrId:'88888888',
				src:2,
        		openId : '',//'135_73_78_146_82_107_136_102_94_130_92_143_103_96_92_129_139_137_94_130_136_128_130_96_103_134_95_135_124_139_126_141_103_148_101_133_69_127_131_148_138_107_129_87_36',//微信
        		payMode : 0,
        		mchLogo:'./static/images/shop-icon.png',//用户头像
        		mchNm:'富友电子',//用户名称
        		payAble:true,
        		appidParms:{}
			}
		},
		methods:{
			showCoupon:function(){//显示弹窗
				if(this.couponsList.length){
					this.showCouponFlag = true;
				}
			},
			closeCoupon:function(){//关闭弹窗
				this.showCouponFlag = false;
			},
			joinId:function(_id){//拼接id,为s+id
				return "s"+_id;
			},
			changeCoupon:function(_price,_min,_id){//选择优惠券
				if(this.payPrice == '0'){
					this.couponPrice = 0;
				}else if(_price>this.payPrice*100 || this.payPrice*100<_min){
				}else{
					this.couponPrice = _price;
					this.selectedCouponItemId = _id;
				}
				this.showCouponFlag = false;
			},
			addRemark:function(){//点击添加备注弹出添加备注供用户输入备注信息
				var _this = this;
				$.prompt({
				  	title: '提示',
				  	text: '请输入备注内容',
				  	input: _this.remarkText,
				  	empty: false, // 是否允许为空
				  	onOK: function (text) {
				    	//点击确认
				    	text = $.trim(text);
					  	if(text){
					  		_this.remarkText = text;
					  	}
				  	},
				  	onCancel: function () {//点击取消
				  		_this.remarkText = "";
				  	},
				});
			},
			inputNum:function(num){//输入数字
		  		if(this.payPrice.indexOf(".") != -1){
		  			var _zeroFlag = false;
		  			var _dotIndex = this.payPrice.indexOf(".");
		  			if((_dotIndex < this.payPrice.length-1) && this.payPrice.substring(_dotIndex+1) == '0'){
		  				//小数点后第一位是0
		  				_zeroFlag = true;
		  			}
		  			if(this.payPrice.length - this.payPrice.indexOf(".") <= 2){
		  				if(_zeroFlag && num == '0'){
		  					
		  				}else{
		  					this.changePayPrice(num);
		  				}
		  				
		  			}
		  		}else{
		  			this.changePayPrice(num);
		  		}
		  	},
		  	delInput:function(){//删除已有输入
		  		if(!this.payAble){
		  			return;
		  		}
		  		this.payPrice = '0';
		  		this.couponPrice = 0;
		  		this.selectedCouponItemId = 0;
		  		if(this.payFlag == true){
		  			this.payFlag = false;
		  		}
		  	},
		  	goToPay:function(){//去支付
		  		if(this.payPrice*100/100>0 && this.payAble){
		  			this.payAble = false;
		  			var _this = this;
		  			var _params = {
		  				qrId: this.qrId,
                        openId:this.openId,
                        payMode:this.payMode,
                        src: this.src,
                        orderAmt:this.payPrice*100-this.couponPrice,//订单实际金额
                        orderAmtOrg:this.payPrice*100,//订单原始金额
                        couponAmt:this.couponPrice,//优惠券金额
                        couponNo:this.selectedCouponItemId?this.selectedCouponItemId+'':''//优惠券编号
		  			};
		  			console.log("order param:",_params);
		  			this.$http.jsonp(httpUrl.pay_order, 
				    	{params: _params}
				    ).then((response) => {
				        // 响应成功回调
				        _this.payAble = true;
				        var _body = response.body;
				        console.log('order成功:',response);
				        if(_body.code != 200){
				        	$.alert(_body.desc);
	                        //window.location.href = 'qrCode.html?qrId='+this.qrId;
	                    }else{
	                    	var _data = _body.data;
	                    	if(_this.payMode == 0){//微信支付
	                    		_this.appidParams = {
		                    		appId:_data.appid,//公众号id
		                    		timeStamp:_data.timestamp,//时间戳
		                    		nonceStr:_data.noncestr,//随机字符串
		                    		package:_data.package,//订单详情扩展字符串
		                    		signType:_data.signType,//签名方式
		                    		paySign:_data.paySign//签名
		                    	}
	                    		//$.alert("wxpayParam:"+JSON.stringify(_this.appidParams));
		                    	if(_this.appidParams && _this.payAble){
		                    		_this.weixinPay();
		                    	}else{
		                    		 $.alert('微信支付发起参数错误');
		                    	}
	                    	}
	                    	if(_this.payMode == 6){//支付宝支付
	                    		var apyOrderNo = _data.payOrderNo;
	                    		_this.tradePay(payOrderNo);
	                    	}
	                    }
				        //this.gridData = response.data;
				    }, (response) => {
				        // 响应错误回调
				        console.log('失败:',response);
				    });
		  		}
		  	},
		  	addDot:function(){//输入小数点
		  		if(this.payPrice.indexOf(".") == -1){//无小数点
		  			if(this.payPrice == '0'){
		  				this.changePayPrice("0.");
		  			}else{
		  				this.changePayPrice(".");
		  			}
		  		}
		  	},
		  	changePayPrice:function(_s){//改变支付金额 
		  		if(!this.payAble){
		  			return;
		  		}
		  		if(_s == '0' && this.payPrice == '0'){//当前值为0，输入也为0，不做处理
		  		}else if(_s != '0' && this.payPrice == '0'){//当前值为0，输入不为0，直接将输入的赋给当前值
		  			if(this.payFlag == false){
		  				this.payFlag = true;
		  			}
		  			this.payPrice = _s;
		  		}else{//当前值不为0，输入不为0，拼接字符串
		  			if(this.payFlag == false){
		  				this.payFlag = true;
		  			}
		  			if(_s == '.' || _s == '0.'){
		  				this.payPrice += _s;
		  			}else{
		  				var _dotIndex = this.payPrice.indexOf(".");
			  			if(_dotIndex == -1){//没有小数点
			  				if(this.payPrice.length >=9){
			  					return;
			  				}
			  			}
			  			this.payPrice += _s;
		  			}
		  		}
	  			var _index = this.getAbleCouponIndex(this.payPrice*100);
		  		if(_index == -1){
		  			this.couponPrice = 0;
		  			this.selectedCouponItemId = 0;
		  		}else{
		  			this.couponPrice = this.couponsList[_index].couponAmt;
		  			this.selectedCouponItemId = this.couponsList[_index].couponNo;
		  		}
		  	},
		  	getAbleCouponIndex:function(_price){//获取可使用的优惠券index
		  		var _index = -1;
		  		var _maxPrice = 0;
		  		if(_price == 0){
		  			return -1;
		  		}
		  		for(var i=0;i<this.couponsList.length;i++){
	  				var _item = this.couponsList[i];
	  				if(_price >= _item.couponAmtMin && _price >= _item.couponAmt){
	  					if(_item.couponAmt > _maxPrice){
	  						_maxPrice = _item.couponAmt;
	  						_index = i;
	  					}
	  				}
	  			}
		  		return _index;
		  	},
		  	preventKeyBoard:function(){
		  		document.activeElement.blur();//去除默认键盘弹框
            	input.selectionEnd = this.value.length; //选中区域右边界
		  	},
			initInfo:function(){
				var _params = {
			        qrId: this.qrId,
                    openId:this.openId,
                    payMode:this.payMode,
                    src:this.src
			    };
			    var _this = this;
			    console.log("params:",_params);//params: Object.assign(_params, httpUrl.com_params)
			    this.$http.jsonp(httpUrl.user_bind, 
			    	{params: _params}
			    ).then((response) => {
			        // 响应成功回调
			        console.log('成功:',response);
			        var _body = response.body;
			        if(_body.code != 200){
                        //window.location.href = 'qrCode.html?qrId='+this.qrId;
                    }else{
                    	var _data = _body.data;
                        if(_data){
                        	var _mch = _data.mch;
                        	var _coupons = _data.coupons;
                        	if(_coupons.length){
                        		_this.couponsList = _coupons;
                        		console.log(_this.couponsList);
                        	}
                            if(_mch.qrLogo){
                            	_this.mchLogo = imgServer+_mch.qrLogo;
                            }
                            _this.mchNm = _mch.mchNm;
                        }
                    }
			        //this.gridData = response.data;
			    }, (response) => {
			        // 响应错误回调
			        console.log('失败:',response);
			    });
			},
			weixinPay:function(){
				var _this = this;
	            function onBridgeReady(){
	                WeixinJSBridge.invoke('getBrandWCPayRequest', _this.appidParams,function(res){
	                    //initBox();
	                    //alert('微信支付接口返回:'+JSON.stringify(res))
	                    //$.alert('微信支付接口返回:'+JSON.stringify(res));
	                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
	                        //window.location.href = 'paySucess.html';
	                        _this.payPrice = '0';
	                        WeixinJSBridge.call('closeWindow');
	                    }else if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
	                        WeixinJSBridge.call('closeWindow');
	                    } else {
	                        WeixinJSBridge.call('closeWindow');
	                    }
	                });
	            };
	            if (typeof WeixinJSBridge == "undefined"){
	                $.alert('WeixinJSBridge该方法不存在');
	                if( document.addEventListener ){
	                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	                }else if (document.attachEvent){
	                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	                }
	            }else{
	                onBridgeReady();
	            }
	        },
	        tradePay:function(tradeNO) {
	            this.ready(function(){
	                // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
	                AlipayJSBridge.call("tradePay", {
	                    tradeNO: tradeNO
	                }, function (data) {
	                    console.log("支付宝支付"+JSON.stringify(data));
	//                    9000 支付成功
	//                    8000 正在处理中
	//                    4000 订单支付失败
	//                    6001用户中途取消
	//                    6002 网络连接出错
	//                    99 用户点击忘记密码界面
	                    if (data.resultCode == "9000") {
	                        console.log("支付成功");
	                    }
	                });
	            });
	        },
	        ready:function(callback) {
	            //$.attr('测试'+window.AlipayJSBridge);
	            if (window.AlipayJSBridge) {
	                callback && callback();
	            } else {
	                document.addEventListener('AlipayJSBridgeReady', callback, false);
	            }
	            
	            //https://chi.fuiou.com/api/mch?qrId=10000007&openId=135_73_78_146_82_107_136_102_94_130_92_143_103_96_92_129_139_137_94_130_136_128_130_96_103_134_95_135_124_139_126_141_103_148_101_133_69_127_131_148_138_107_129_87_36_&payMode=0&src=0&callback=_jsonpn6r69oupf2n
	           // https://chi.fuiou.com/pay/api/mch?callback=jQuery21409425848427846444_1504766612882&qrId=10000007&openId=104_127_110_94_106_129_132_131_104_146_73_132_140_69_92_78_138_105_114_91_96_142_82_76_92_136_110_104_116_112_126_109_130_138_137_126_79_101_147_99_77_132_115_87_36_&payMode=6&src=0&_=1504766612883
	        },
	        getAddressParam:function (name){//获取地址栏参数
			  	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			  	var r = window.location.search.substr(1).match(reg);
			  	if(r!=null)
			  		return  unescape(r[2]); 
			  	return null;
			}
		},
		computed:{
			getPayModeText:function(){
				if(this.payMode == 6){
					return '支付宝<br/>支付';
				}else if(this.payMode == 0){
					return '微信<br/>支付'
				}else{
					return '支付';
				}
			}
		},
		mounted:function(){
			if(this.couponsList.length){
				var _maxNum = 0;
				var _selectedId = 0;
				for(var i = 0;i<this.couponsList.length;i++){
					if(this.couponsList[i].num > _maxNum){
						_maxNum = this.couponsList[i].num;
						_selectedId = this.couponsList[i].id;
					}
				}
				this.selectedCouponItemId = _selectedId;
				this.couponPrice = _maxNum;
			}else{
				this.selectedCouponItemId = 0;
				this.couponPrice = 0;
			}
			this.initInfo();
		},
		created:function(){
			if(this.$route.query.payMode){
				this.payMode = this.$route.query.payMode;
			}
			if(this.$route.query.qrId){
				this.qrId = this.$route.query.qrId;
			}
			if(this.$route.query._PO2OPAYOPENID_){
				this.openId = this.$route.query._PO2OPAYOPENID_;
			}
			if(this.$route.query.src){
				this.src = this.$route.query.src;
			}
			//$.alert(window.location.href);
		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/style/pay/pay.less";
</style>