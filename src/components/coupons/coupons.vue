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
			        	<p class="weui-media-box__desc">联系电话：<a :href="'tel:'+item.mchMobile">{{item.mchMobile}}</a></p>
			      	</div>
			    </a>
			</div>
			<div class="coupons-list">
				<div v-for="list in item.datas" class="weui-media-box weui-media-box_text border-bottom" :class="{unavailable:getCouponUseStateFlag(list.couponStDesc)}">
		            <h4 class="weui-media-box__title">{{list.couponNm}}<span class="coupon-state">{{getCouponUseStateText(list.couponStDesc)}}</span></h4>
		            <p class="weui-media-box__desc">使用条件：{{getCouponUseCondition(list.couponAmt,list.couponAmtMin)}}</p>
		            <p class="weui-media-box__desc">优惠券有效期：{{formatCouponDate(list.startDt)}}-{{formatCouponDate(list.expireDt)}}</p>
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
	var imgServer = 'https://staticds.fuiou.com/';
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
			    ).then(function(response){
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
                    	_this.sortCoupons(_data);
                    }
			    }, function(response){
			        // 响应错误回调
			        console.log('失败:',response);
			    });
			},
			sortCoupons:function(_data){
				var _coupons = [];
				for(var i = 0;i < _data.length;i++){
					var _mchId = ''+_data[i].mchId;
					if(_coupons.length){//如果数组不为空
						var _flag = false;
						for(var key in _coupons){
							if(_coupons[key]["mchId"] == _mchId){
								_flag = true;
								_coupons[key]["datas"].push(_data[i]);
								break;
							}
						}
						if(!_flag){
							_coupons.push(this.pushData(_data[i]));
						}
					}else{
						_coupons.push(this.pushData(_data[i]));
					}
				}
				this.couponsList = _coupons;
				console.log("sorted:",_coupons);
			},
			pushData:function(_data){
				var _item = {
					mchNm:_data.mchNm,
					mchMobile:_data.mchMobile,
					mchId:_data.mchId,
					mchAddr:_data.mchAddr,
					datas:[]
				};
				if(_data.mchLogo == ''){
					_item.mchLogo = './static/images/shop-icon.png';
				}else{
					_item.mchLogo = imgServer+_data.mchLogo;
				}
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
			},
			checkLogoShowAble:function(_logo){
				if(_logo == 'https://staticds.fuiou.com/'){
					return false;
				}else{
					return true;
				}
			}
		},
		created:function(){
			if(this.$route.query._PO2OOPENID_){ 
				this.openId = this.$route.query._PO2OOPENID_;
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
.border-bottom{
    border-bottom:1px solid #797979;   
}
.weui-media-box_appmsg{
    .weui-media-box__thumb{
        height:100%;
        border-radius:50%;
    }
    .weui-media-box__bd{
    	a{
    		text-decoration: underline;
    	}
    }
} 
.coupons-list{
    .weui-media-box{
        padding-top:5px;
        padding-bottom:5px;
        &.border-bottom{
            border-bottom:1px solid #797979;
            &:last-of-type{
                border-bottom:0;
            }
        }
        &.unavailable{
            color:#999;
        }
        .weui-media-box__title{
            position:relative;
            .coupon-state{
                position:absolute;
                right:0;
                bottom:0;
                font-size:14px;
            }
        }
        .weui-media-box__desc{
            padding-top:2px;
            padding-bottom:2px;
        }
    }
}
</style>