// pages/sellmanage/sellmanage.js
const app = getApp()
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    TargetTurnover:0,
    // tempTargetTurnover:0
  },
  //输入营业额目标值
  inpTargetTurnover(e){
    // console.log(e.detail)
    this.setData({
      TargetTurnover:e.detail
    })
    // console.log(this.data.TargetTurnover)
  },
  //设置营业额目标值
  btnTargetTurnover(){
    wx.showLoading({
      title: '提交数据中',
      mask:true
    })
    // this.setData({
    //   TargetTurnover:this.data.tempTargetTurnover
    // })
    // app.globalData.TargetTurnover=this.data.tempTargetTurnover
    // console.log("本页面营业额",this.data.TargetTurnover)
    // console.log("全局营业额",app.globalData.TargetTurnover)wx
    wx.cloud.callFunction({
      name:'bossUpdateSet',
      data:{
        id:this.data.id,
        TargetTurnover:this.data.TargetTurnover
      }
    }).then(res=>{
      wx.hideLoading({
        complete: (res) => {},
      })
      Notify({ type: 'success',duration: 3000, message: '已更新目标营业额'});
      console.log("完成更新目标营业额")
      console.log(res)
    })
  },
  //获取目标营业额
  bossGetSet(){
    wx.cloud.callFunction({
      name:"bossGetSet"
    }).then(res=>{
      console.log(res)
      this.setData({
        TargetTurnover:res.result.data.TargetTurnover,
        id:res.result.data._id
      })
      console.log(typeof(Number(this.data.TargetTurnover)))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //   this.setData({
  //     TargetTurnover:app.globalData.TargetTurnover
  //   })
  //   // this.data.TargetTurnover = app.globalData.TargetTurnover
  //   console.log("全局变量目标营业额：",app.globalData.TargetTurnover)
  wx.showLoading({
    title: '数据加载中',
    mask:true
  })
  this.bossGetSet()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading({
      complete: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   TargetTurnover:app.globalData.TargetTurnover
    // })
    // console.log("全局变量目标营业额：",app.globalData.TargetTurnover)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // var that = this;
    wx.reLaunch({
      url: '/pages/sellmanage/sellmanage',
      success:function(res){
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})