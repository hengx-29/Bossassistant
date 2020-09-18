// pages/printsetup/printsetup.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    printTitle:''
  },
  //输入打印标题
  inpPrinttitle(e){
    // console.log(e)
    this.setData({
      printTitle:e.detail.value
    })
  },
  //设置打印标题
  btnPrinttitle(){
    wx.cloud.callFunction({
      name:'bossUpdateSet',
      data:{
        id:this.data.id,
        printTitle:this.data.printTitle
      }
    }).then(res=>{
      Notify({ type: 'success',duration: 3000, message: '已更新打印设置'});
      console.log("完成更新打印设置")
      console.log(res)
    })
  },
  //获取打印设置
  bossGetSet(){
    wx.cloud.callFunction({
      name:"bossGetSet"
    }).then(res=>{
      console.log(res)
      this.setData({
        printTitle:res.result.data.printTitle,
        id:res.result.data._id
      })
      console.log(this.data.printTitle)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      url: '/pages/printsetup/printsetup',
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