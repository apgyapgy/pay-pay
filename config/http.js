/**
 * Created by user on 2017/9/5.
 */
import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000;// `timeout`指定请求超时之前的毫秒数。
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头
axios.defaults.baseURL = 'https://o2omch.fuiou.com/';//配置基础URL路径
//url: 'https://dswx-test.fuiou.com/o2o-mch/'+options.url,
//url: 'https://o2omch.fuiou.com/'+options.url,
//get传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  if(config.method  === 'get'){
    config.data = qs.stringify(config.data);
  }
  return config;
},(error) =>{
  alert("错误的传参");
  return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
  //对响应数据做些事
  if(!res.data.success){
    // _.toast(res.data.msg);
    return Promise.reject(res);
  }
  return res;
}, (error) => {
  //_.toast("网络异常", 'fail');
  return Promise.reject(error);
});
// //返回一个Promise(发送post请求)
// export function fetch(url, params) {
//   return new Promise((resolve, reject) => {
//     axios.get(url, params)//// `baseURL`将被添加到`url`前面，除非`url`是绝对的。
//       .then(response => {
//         resolve(response.data);
//       }, err => {
//         reject(err);
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })

export default axios;
