<template>
	<div class="coupons">
		<div v-for="item in couponsList" class="weui-panel weui-panel_access">
			<div class="weui-panel__bd border-bottom">
			    <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
			      	<div class="weui-media-box__hd">
			        	<img class="weui-media-box__thumb" src="./shop-icon.png" :src="item.mchLogo">
			      	</div>
			      	<div class="weui-media-box__bd">
			        	<h4 class="weui-media-box__title">{{item.mchNm}}</h4>
			        	<p class="weui-media-box__desc">地址：{{item.mchAddr}}</p>
			        	<p class="weui-media-box__desc">联系电话：{{item.mchMobile}}</p>
			      	</div>
			    </a>
			</div>
			<div class="coupons-list">
				<div v-for="list in item.datas" class="weui-media-box weui-media-box_text border-bottom" :class="{unavailable:getCouponUseStateFlag(list.couponStDesc)}">
		            <h4 class="weui-media-box__title">{{list.couponNm}}<span class="coupon-state">{{getCouponUseStateText(list.couponStDesc)}}</span></h4>
		            <p class="weui-media-box__desc">使用条件：{{getCouponUseCondition(list.couponAmt,list.couponAmtMin)}}</p>
		            <p class="weui-media-box__desc">优惠券有效期：{{formatCouponDate(list.couponDt)}}-{{formatCouponDate(list.expireDt)}}</p>
		        </div>
			</div>
		</div>
		<div v-show="!couponsList.length" class="weui-loadmore weui-loadmore_line">
		  	<span class="weui-loadmore__tips">暂无数据</span>
		</div>
	</div>
</template>
<script>
  	$(function() {
    	FastClick.attach(document.body);
 	});
</script>
<script>
	import {httpUrl} from '../../assets/js/http_url';
	var imgServer = 'https://static.fuiou.com/';
	export default{
		data(){
			return{
				couponsList:[],
				couponList:{},
				openId:'137_93_75_131_124_128_128_78_113_140_148_108_78_148_141_114_92_104_147_146_101_73_134_110_103_96_81_141_77_75_107_98_144_69_131_132_134_137_103_99_111_146_129_87_36_',
				src:2
			}
		},
		methods:{
			getCoupons:function(){
				var _params = {
					openId:this.openId,
					src:this.src
				};
				var _this = this;
				this.$http.jsonp(httpUrl.get_coupons,
			    	{params: _params}
			    ).then((response) => {
			        // 响应成功回调
			        console.log('成功:',response);
			        var _body = response.body;
			        if(_body.code != 200){
                        //window.location.href = 'qrCode.html?qrId='+this.qrId;
                    }else{
                    	var _data = _body.data;
                    	if(_data.datas.length){
                    		_data = _data.datas;
                    	}
                    	console.log("haha:",_data);
                    	_this.sortCoupons(_data);
                    }
			    }, (response) => {
			        // 响应错误回调
			        console.log('失败:',response);
			    });
			},
			sortCoupons:function(_data){
				var _coupons = [];
				for(var i = 0;i < _data.length;i++){
					var _mchId = ''+_data[i].mchId;
					if(_coupons.length){
						for(var key in _coupons){
							if(_coupons[key]["mchId"] == _mchId){
								_coupons[key]["datas"].push(_data[i]);
								break;
							}else{
								_coupons.push(this.pushData(_data[i]));
							}
						}
					}else{
						_coupons.push(this.pushData(_data[i]));
					}
				}
				this.couponsList = _coupons;
				//console.log((this.couponsList));
			},
			pushData:function(_data){
				var _item = {
					mchNm:_data.mchNm,
					mchMobile:_data.mchMobile,
					mchId:_data.mchId,
					mchAddr:_data.mchAddr,
					mchLogo:imgServer+_data.mchLogo,
					datas:[]
				};
				_item.datas.push(_data);
				return _item;
			},
			getCouponUseCondition:function(old,plus){//获取优惠券使用条件
				if(plus == 0){
					return '单笔订单减'+(old/100)+'元';
				}else{
					return '单笔订单满'+(plus/100)+'元减'+(old/100)+'元';
				}
			},
			getCouponUseStateText:function(_status){//获取优惠券使用状态描述
				if(_status == '未使用'){
					return '';
				}else{
					return _status;
				}
			},
			getCouponUseStateFlag:function(_status){//获取优惠券使用状态
				if(_status == '未使用'){
					return false;
				}else{
					return true;
				}
			},
			formatCouponDate:function(_date){//格式化日期 将20170911 转换为2017.09.11
				_date = _date+'';
				return _date.substring(0,4)+'.'+_date.substring(4,6)+'.'+_date.substring(6,8);
			},
			joinImgUrl:function(_url){
				return imgServer + _url;
			}
		},
		created:function(){
			if(this.$route.query._PO2OPAYOPENID_){
				this.openId = this.$route.query._PO2OPAYOPENID_;
			}
			if(this.$route.query.src){
				this.src = this.$route.query.src;
			}
			this.getCoupons();
		},
		mounted:function(){
			
		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/style/coupons/coupons.less";
</style>