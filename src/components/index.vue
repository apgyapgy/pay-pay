<template>
  <div id="index" class="wf bgfff">
    <div class="header">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <img class="userPhoto fl" src="../../static/images/user.png">
        </div>
        <div class="weui-cell__bd">
          <p>富友电商</p>
        </div>
        <div class="weui-cell__ft white">
          <a href="javascript:void(0);" class="weui-cell weui-cell_access">
            <div class="weui-cell__bd">退出</div>
            <span class="weui-cell__ft"></span>
          </a>
        </div>
      </div>
      <div class="index-money">
        <span class="block">账面余额</span>
        <b id="balanceYuan" class="block totalAmt">100.00</b>
      </div>
    </div>
    <div class="index-content">
      <div class="weui-panel">
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_small-appmsg">
            <div class="weui-cells">
              <div class="weui-form-preview__ft line30" style="padding: 20px;">
                <div class="weui-form-preview__btn weui-form-preview__btn_default">
                  <span id="dailyAmtYuan" class="block blue font25">58.80</span>
                  <span class="block font12">今日收款金额(元)</span>
                </div>
                <div class="weui-form-preview__btn weui-form-preview__btn_default">
                  <span id="dailyNum" class="block blue font25">50</span>
                  <span class="block font12">今日收款笔数</span>
                </div>
              </div>
            </div>
            <div class="weui-cells">
              <a id="orderList" class="weui-cell weui-cell_access">
                <div class="weui-cell__hd">
                  <img class="weui-cell_icon" src="../../static/images/search-icon.png" alt="交易查询"></div>
                <div class="weui-cell__bd weui-cell_primary">
                  <p>交易查询</p>
                </div>
                <span class="weui-cell__ft"></span>
              </a>
              <a class="weui-cell weui-cell_access" href="payRecord.html">
                <div class="weui-cell__hd">
                  <img class="weui-cell_icon" src="../../static/images/record-icon.png" alt="资金到账记录"></div>
                <div class="weui-cell__bd weui-cell_primary">
                  <p>资金到账记录</p>
                </div>
                <span class="weui-cell__ft"></span>
              </a>
              <router-link to="/coupon" class="weui-cell weui-cell_access">
                <div class="weui-cell__hd">
                  <img class="weui-cell_icon" src="../../static/images/record-icon.png" alt="优惠券"></div>
                <div class="weui-cell__bd weui-cell_primary">
                  <p>优惠券</p>
                </div>
                <span class="weui-cell__ft"></span>
              </router-link>
              <router-link to="/fansManage" class="weui-cell weui-cell_access">
                <div class="weui-cell__hd">
                  <img class="weui-cell_icon" src="../../static/images/record-icon.png" alt="粉丝管理"></div>
                <div class="weui-cell__bd weui-cell_primary">
                  <p>粉丝管理</p>
                </div>
                <span class="weui-cell__ft"></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {httpUrl} from '../assets/js/http_url';
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      gridData: []
    }
  },
  methods: {
    fetchData() {
      var params = {
        qrId: '86542688',
        src:2,
        openId:3
      };
      this.$http.jsonp(httpUrl.user_bind, {params: Object.assign(params, httpUrl.com_params)}).then((response) => {
        // 响应成功回调
        console.log('成功'+response.data.code);
        this.gridData = response.data;
      }, (response) => {
        // 响应错误回调
        console.log('失败'+response);
      });
    },
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{
    width: 100%;
    float: left;
    background: #30b2fb;
    color: #FFFFFF;
    line-height: 40px;
  }
  .header .userPhoto{
    width: 40px;
    height: 40px;
    margin-right: 5px;
    border-radius: 100%;
  }
  .index-money{
    text-align: center;
    padding: 40px 0 30px 0;
  }
  .index-money .totalAmt{
    font-size: 50px;
    line-height: 60px;
  }
  .index-content{
    width: 100%;
    float: left;
    padding-right: 15px;
  }
  .header .weui-cell_access .weui-cell__ft::after{
    border-color: #FFFFFF;
  }
</style>
