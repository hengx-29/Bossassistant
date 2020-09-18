//app.js
//import { promisifyAll, promisify } from 'miniprogram-api-promise';

App({
  globalData: {
    // TargetTurnover:26000,
    userInfo: null,
    initFlag: true,
    openid: null,
    appid: null,
    webPath: "https://op.yundasys.com/opserver",
    decodeUserInfoUrl: "/interface/wxapp/decodeUserInfo4wxApp.do",
    interfaceUrl: "/interface.do",
    platform: 'ios',
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    var self = this
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.platform)

        self.globalData.platform = res.platform;
      }
    })

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          console.log("code:"+code)  
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)

              that.globalData.initFlag = false;
            }
          })
        }
      })
    }
  },
  //
  generateRequestObj:function(options, cb){
       options = options || {};
       if(!this.globalData.initFlag){
          var data = 'action='+options.action+
             '&version='+options.version+
             '&req_time='+new Date().getTime()+
             '&openid='+ this.globalData.openid+
             '&appid='+ this.globalData.appid+
             '&data='+JSON.stringify(options.data)
             typeof cb == "function" && cb({
               requestUrl:this.globalData.webPath + this.globalData.interfaceUrl + "?" + options.action + "&" + this.globalData.appid
               + "&" + data
             });
       } else{
         setTimeout(function(){
           getApp().generateRequestObj(options, cb);
         },100);
       }
  }
})

