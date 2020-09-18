// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unfinishbill:" ",//未结算数量
  },
  /**
   * 获取未结算数量
   */
  getUnfinishbill(){
    wx.cloud.callFunction({
      name:"billGetData",
      data:{
        status:"0"
      }
    }).then(res=>{
      // console.log(res)
      // console.log(typeof(res.result.data.length))
      this.setData({
        unfinishbill:res.result.data.length
      })
    })
  },
  /**
   * 客服电话
   */
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '15272508416',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    this.getUnfinishbill()
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
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    this.getUnfinishbill()
    wx.hideLoading({
      complete: (res) => {},
    })
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