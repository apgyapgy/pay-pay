import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Pay from '@/components/pay/pay'
import Coupons from '@/components/coupons/coupons'
import Result from '@/components/result/result'
Vue.use(Router)

export default new Router({
	//mode:'history',
	//base:'/h5/pay/',
  	routes: [{
      	path: '/',
      	name: 'Pay',
      	meta: {
        	title: '自助收银'
      	},
      	component: Pay,
    },{
      	path: '/pay',
      	name: 'Pay',
      	meta: {
        	title: '自助收银'
      	},
      	component: Pay,
    },{
    	path:'/coupons',
    	name:'Coupons',
    	meta:{
    		title:'我的卡券包'
    	},
    	component:Coupons
    },{
    	path:'*',
    	name:'Pay',
    	meta:{
    		title:'自助收银'
    	},
    	component:Pay
    },{
      path:'/result',
      name:'Result',
      meta:{
        title:''
      },
      component:Result
    }]
})
