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
		    <!--<a id="addRemarks" v-show="remarkText.length==0" @click="addRemark" class="main-tip">添加备注</a>-->
		    <span v-show="showCouponInfoFlag" class="pay-coupon" @click="showCoupon">-￥{{couponPrice/100}}(可用优惠券{{count}}张)&gt;</span>
		    <!--<label v-show="remarkText.length>0" class="remarks">{{remarkText.length>6?remarkText.substring(0,6)+'...':remarkText}}</label>-->
		    <!--<a v-show="remarkText.length>0" id="updateRemarks" @click="addRemark" class="main-tip">修改</a>-->
		</div>
		<footer class="main-footer">
		    <p>由富友收件宝提供技术支持</p>
		    <!--<p>由富友收件宝<img src="images/fuiou.png" style="height: 20px">提供技术支持</p>-->
		    <table class="main-table" width="100%" border="0" cellspacing="0" cellpadding="0">
		        <tr>
		            <td @touchstart="inputNum('1')" width="25%" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="1">1</a></td>
		            <td @touchstart="inputNum('2')" width="25%" class="border-bottom0 border-right0"><a class="number" data-values="2">2</a></td>
		            <td @touchstart="inputNum('3')" width="25%" class="border-bottom0 border-right0"><a class="number" data-values="3">3</a></td>
		            <td @touchstart="delInput" class="border-right0 border-bottom0 border-right0"><a id="del" class="del">←</a></td>
		        </tr>
		        <tr>
		            <td @touchstart="inputNum('4')" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="4">4</a></td>
		            <td @touchstart="inputNum('5')" class="border-bottom0 border-right0"><a class="number" data-values="5">5</a></td>
		            <td @touchstart="inputNum('6')" class="border-bottom0 border-right0"><a class="number" data-values="6">6</a></td>
		            <td @touchstart="goToPay" class="border-right0" rowspan="3" id="pay" :class="{pay:payFlag}"><a class="payName" :class="{white:payFlag}" v-html="getPayModeText"></a></td>
		        </tr>
		        <tr>
		            <td @touchstart="inputNum('7')" class="border-left0 border-bottom0 border-right0"><a class="number" data-values="7">7</a></td>
		            <td @touchstart="inputNum('8')" class="border-bottom0 border-right0"><a class="number" data-values="8">8</a></td>
		            <td @touchstart="inputNum('9')" class="border-bottom0 border-right0"><a class="number" data-values="9">9</a></td>
		        </tr>
		        <tr>
		            <td @touchstart="inputNum('0')" class="border-left0 border-right0" colspan="2"><a class="number" data-values="0">0</a></td>
		            <td @touchstart="addDot" class="border-right0"><a class="number" data-values=".">.</a></td>
		        </tr>
		    </table>
		</footer>
		<div id="coupon-wrapper" :class="{active:showCouponFlag}" @click.self="closeCoupon">
			<div class="coupons">
				<div class="title">可用优惠券</div>
				<div class="weui-cells weui-cells_checkbox coupons-content clear">
				  	<label v-for="(item,index,key) in couponsList" @click.self="changeCoupon(item.couponAmt,item.couponAmtMin,item.couponNo)" class="weui-cell weui-check__label" :for="joinId(item.id)" :class='{hide:checkDisabled(item.couponAmtMin)}'>
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
	import {httpUrl} from '../../assets/js/http_url';
	export default{
		data(){
			return{
				showCouponFlag:false,
				couponsList:[
					/*{
						couponAmt:4,
						couponAmtMin:0,
						couponNo:111,
						id:1,
						couponNm:'hh'
					}*/
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
        		appidParms:{},
        		showCouponInfoFlag:false,
        		payOrderNo:'',
        		count:0
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
				//console.log(_price,_min,this.payPrice*100,_price>=this.payPrice*100,this.payPrice*100<_min)
				var _payPrice = this.accMul(this.payPrice,100);
				if(this.payPrice == '0'){
					this.couponPrice = 0;
					this.showCouponInfoFlag = false;
				}else if(_payPrice<_min){ //_price>_payPrice || 
					this.showCouponInfoFlag = true;
				}else{
					if(this.selectedCouponItemId == _id){
						this.couponPrice = 0;
						this.selectedCouponItemId = '';
					}else{
						this.couponPrice = _price;
						this.selectedCouponItemId = _id;
					}
					
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
				this.showCouponInfoFlag = false;
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
                        //orderAmt:_payPrice-this.couponPrice,//订单实际金额
                        orderAmtOrg:this.payPrice-0,//订单原始金额
                        //couponAmt:this.couponPrice,//优惠券金额
                        //couponNo:this.selectedCouponItemId?this.selectedCouponItemId+'':''//优惠券编号
		  			};
		  			if(this.couponPrice != 0){
		  				//_params.couponAmt = this.couponPrice;
		  				_params.couponNo = this.selectedCouponItemId;
		  			}
		  			this.$http.jsonp(httpUrl.pay_order, 
				    	{params: _params}
				    ).then(function(response){
				        // 响应成功回调
				        _this.payAble = true;
				        var _body = response.body;
				        console.log('order成功:',response);
				        if(_body.code != 200){
				        	$.alert(_body.desc);
	                        //window.location.href = 'qrCode.html?qrId='+this.qrId;
	                    }else{
	                    	var _data = _body.data;
	                    	//$.alert(JSON.stringify(_data));
	                    	if(_data.tradeAmt > 0){
	                    		if(_this.payMode == 0){//微信支付
		                    		_this.appidParams = {
			                    		appId:_data.appid,//公众号id
			                    		timeStamp:_data.timestamp,//时间戳
			                    		nonceStr:_data.noncestr,//随机字符串
			                    		package:_data.package,//订单详情扩展字符串
			                    		signType:_data.signType,//签名方式
			                    		paySign:_data.paySign//签名
			                    	}
		                    		_this.payOrderNo = _data.outOrderNo;
		                    		//$.alert("wxpayParam:"+JSON.stringify(_this.appidParams));
			                    	if(_this.appidParams && _this.payAble){
			                    		_this.weixinPay();
			                    	}else{
			                    		 $.alert('微信支付发起参数错误');
			                    	}
		                    	}
		                    	if(_this.payMode == 6){//支付宝支付
		                    		//$.alert("order返回："+JSON.stringify(_data))
		                    		//var apyOrderNo = _data.outOrderNo;
		                    		var apyOrderNo = _data.payOrderNo;
		                    		_this.tradePay(apyOrderNo);
		                    	}
	                    	}else{
	                    		$.alert("支付成功",function(){
	                    			if(_this.payMode == 0){
	                    				WeixinJSBridge.call('closeWindow');
	                    			}else if(_this.payMode == 6){
	                        			AlipayJSBridge.call('popWindow');
	                    			}
	                    		});
	                    	}
	                    }
				        //this.gridData = response.data;
				    }, function(response){
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
		  		var _payPrice = this.accMul(this.payPrice,100);
	  			var _index = this.getAbleCouponIndex(_payPrice);
		  		if(_index == -1){
		  			this.couponPrice = 0;
		  			this.selectedCouponItemId = 0;
					this.showCouponInfoFlag = false;
		  		}else{
		  			this.couponPrice = this.couponsList[_index].couponAmt;
		  			this.selectedCouponItemId = this.couponsList[_index].couponNo;
					this.showCouponInfoFlag = true;
		  		}
		  		var _count = 0;
		  		for(var i = 0;i<this.couponsList.length;i++){
					if( _payPrice >= this.couponsList[i].couponAmtMin){
						_count++;
					}
		  		}
		  		this.count = _count;
		  	},
		  	getAbleCouponIndex:function(_price){//获取可使用的优惠券index
		  		var _index = -1;
		  		var _maxPrice = 0;
		  		if(_price == 0){
		  			return -1;
		  		}
		  		for(var i=0;i<this.couponsList.length;i++){
	  				var _item = this.couponsList[i];
	  				if(_price >= _item.couponAmtMin){// && _price >= _item.couponAmt
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
			    ).then(function(response){
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
                        		//console.log(_this.couponsList);
                        	}
                            if(_mch.qrLogo){
                            	let imgServer = 'https://static.fuiou.com/';
                            	_this.mchLogo = imgServer+_mch.qrLogo;
                            }
                            _this.mchNm = _mch.mchNm;
                        }
                    }
			        //this.gridData = response.data;
			    }, function(response){
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
	                    //$.alert('微信支付接口返回:'+JSON.stringify(res));return;
	                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
	                        //window.location.href = 'paySucess.html';
	                        _this.payPrice = '0';
	                        WeixinJSBridge.call('closeWindow');
	                    }else if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
	                    	_this.cancelPay();
	                        //WeixinJSBridge.call('closeWindow');
	                    } else {
	                    	_this.cancelPay();
	                       // WeixinJSBridge.call('closeWindow');
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
	        	var _this = this;
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
						//$.alert("支付宝支付返回："+JSON.stringify(data));
	                    if (data.resultCode == "9000") {
	                        console.log("支付成功");
	                        AlipayJSBridge.call('popWindow');
	                    }else{
	                    	_this.cancelPay();
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
			},
			checkDisabled:function(_min){ // !(payPrice*100>item.couponAmt&&payPrice*100>item.couponAmtMin)
				var _payPrice = this.accMul(this.payPrice,100);
				if( _payPrice >= _min){//_payPrice >= _price &&
					return false;
				}else{
					return true;
				}
			},
			accMul:function(arg1,arg2){ 
				var m=0,s1=arg1,s2=arg2.toString(); 
				try{m+=s1.split(".")[1].length}catch(e){} 
				try{m+=s2.split(".")[1].length}catch(e){} 
				return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
			},
			cancelPay:function(){//取消支付，释放优惠券
				var _this = this;
				//$.alert(this.couponPrice+":"+this.selectedCouponItemId+":"+httpUrl.cancel_pay+this.payOrderNo);return;
				if(this.couponPrice != 0){ //已选择优惠券
	  				this.$http.jsonp(httpUrl.cancel_pay+_this.payOrderNo
	  				).then(function(response){
	  					//$.alert("url:"+httpUrl.cancel_pay+_this.payOrderNo+":success"+JSON.stringify(response.body));
	  					if(_this.payMode == 0){
	  						WeixinJSBridge.call('closeWindow');
	  					}
	  					if(_this.payMode == 6){
	                        AlipayJSBridge.call('popWindow');
	  					}
	  				},function(response){
	  					$.alert("error:"+JSON.stringify(response.body));
	  					if(_this.payMode == 0){
	  						WeixinJSBridge.call('closeWindow');
	  					}
	  					if(_this.payMode == 6){
	                        AlipayJSBridge.call('popWindow');
	  					}
	  				});
	  			}else{
	  				if(_this.payMode == 0){
	  					WeixinJSBridge.call('closeWindow');
	  				}
	  				if(_this.payMode == 6){
	  					AlipayJSBridge.call('popWindow');
	  				}
	  			}
			},
			
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
				this.showCouponInfoFlag = true;
			}else{
				this.selectedCouponItemId = 0;
				this.couponPrice = 0;
				this.showCouponInfoFlag = false;
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
.pay{
    .main-panel{
        #addRemarks{
            float:left;
            display:block;
            width:40%;
        }
        .pay-coupon{
            float:right;
            width:60%;
            font-size:14px;
            text-align:right;
            color:#f00;
        }
        .remarks{
            float:left;
        }
        #updateRemarks{
            display:block;
            float:left;
        }
    }
    #coupon-wrapper{
        display:none;
        position:fixed;
        left:0;
        top:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.2);
        transition:all .3s;
        z-index:1000;
        &.active{
            display:block;
        }
        .coupons{ 
            position: absolute;
            width: 80%;
            max-width: 300px;
            top: 45%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            font-size:16px;
            background:#fff;
            border-radius:3px;
            .title{
                position:relative;
                padding-top:.8em;
                padding-bottom:.8em;
                width:100%;
                font-size:18px;
                &:before{
                    content:"";
                    position:absolute;
                    bottom: 0;
                    left:0;
                    width:100%;
                    border-bottom: 1px solid #d9d9d9;
                    -webkit-transform-origin: 0 0;
                    transform-origin: 0 0;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                }
            }
            .coupons-content{
                padding-bottom:.5rem;
                max-height:300px;
                overflow-y:scroll;
                &.weui-cells{
                    margin-top:0;
                    padding-left:1.5em;
                    padding-right:1.5em;
                    &:before{
                        display:none;
                    }
                    .weui-cell{
                        &.disabled{
                           color:#999;
                        }
                       .weui-cell__bd{
                            text-align:left;
                            overflow-x:hidden ;
                        } 
                    }
                }
            }
        }
    }
}
</style>