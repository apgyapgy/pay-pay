//环境
let localhostDev = true;
//如果是本地开发，就把localhostDev 设置成true，连接就是拼成‘http://localhost:8080/api/test’
//生产环境，就把localhostDev 设置成false，连接就是拼成‘http://xxx.com/api/test’
let _host= localhostDev ? 'https://dswx-test.fuiou.com/o2o/pay' : 'https://o2omch.fuiou.com';
let _comparams = {
  'clientType': 2,
};
if(localhostDev){
	var _couponsHost = _host.replace("pay","wx_c");
}else{
	var _couponsHost = _host;
}
let httpUrl = {
  //参数
  'com_params': _comparams,//客户端类型：0苹果IOS、1安卓Android、2微信公众号、3微信小程序
  //各接口
  'user_bind': _host + '/api/mch',
  'pay_order':_host+'/api/order',
  'get_coupons':_couponsHost+'/api/coupons'
};
export {httpUrl}
