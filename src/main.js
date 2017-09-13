// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueWechat from 'vue-wechat-title'
import 'babel-polyfill'

import './assets/css/weui.min.css'
import './assets/css/jquery-weui.min.css'
import './assets/css/common.css'
import './assets/js/fastclick.js'
import './assets/js/jquery-weui.js'
import './assets/js/common.js'

Vue.config.productionTip = false
// Vue.prototype.$http = axios
Vue.use(VueResource);
Vue.use(VueWechat);

Vue.http.options.emulateJSON = true;
// Vue.http.headers.contentType ='application/x-www-form-urlencoded;charset=utf-8';
Vue.http.interceptors.push((request, next) => {
  $.showLoading();
  request.jsonp = 'callback';
  next((response) => {
    setTimeout(function() {
      $.hideLoading();
    }, 500)
    return response
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
