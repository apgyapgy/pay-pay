/**
 * Created by user on 2017/9/5.
 */
function getCurrentDate(){
  var day=new Date();
  var Year=0;
  var Month=0;
  var Day=0;
  var Hour = 0;
  var Minute = 0;
  var Second = 0;
  var CurrentDate="";
  //初始化时间
  Year       = day.getFullYear();
  Month      = day.getMonth()+1;
  Day        = day.getDate();
  Hour       = day.getHours();
  Minute     = day.getMinutes();
  Second     = day.getSeconds();
  CurrentDate = Year + "-";
  if (Month >= 10 )
  {
    CurrentDate = CurrentDate + Month + "-";
  }
  else
  {
    CurrentDate = CurrentDate + "0" + Month + "-";
  }
  if (Day >= 10 )
  {
    CurrentDate = CurrentDate + Day +" ";
  }
  else
  {
    CurrentDate = CurrentDate + "0" + Day +"";
  }
  // if(Hour >=10)
  // {
  //     CurrentDate = CurrentDate +" "+ Hour ;
  // }
  // else
  // {
  //     CurrentDate = CurrentDate + "0" + Hour ;
  // }
  // if(Minute >=10)
  // {
  //     CurrentDate = CurrentDate + ":" + Minute ;
  // }
  // else
  // {
  //     CurrentDate = CurrentDate + ":0" + Minute ;
  // }
  // if(Second>=10)
  // {
  //     CurrentDate = CurrentDate + ":" + Second;
  // }
  // else
  // {
  //     CurrentDate = CurrentDate + ":0" + Second;
  // }
  return CurrentDate;
}
//获取N天前的日期
function getBeforeDate(n){
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon=d.getMonth()+1;
  var day=d.getDate();
  if(day <= n){
    if(mon>1) {
      mon=mon-1;
    }
    else {
      year = year-1;
      mon = 12;
    }
  }
  d.setDate(d.getDate()-n);
  year = d.getFullYear();
  mon=d.getMonth()+1;
  day=d.getDate();
  s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
  return s;
}
//判断起始日期与结束日期大小
function checkDate(starttime,endtime,fn) {
  var start = new Date(starttime.replace(/-/g, "/"));
  var end = new Date(endtime.replace(/-/g, "/"));
  if (end < start) {
    fn();
    return false;
  }
  else {
    return true;
  }
}
//字符串转化为时间格式2014-11-02
function getFormatData(time){
  var strDate = time.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"); //精确到日
  return 	strDate;
}
//获取地址栏参数
function getAddressParam(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
};
