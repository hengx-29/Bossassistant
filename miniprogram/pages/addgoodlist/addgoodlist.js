// pages/addgoodlist/addgoodlist.js
//初始化环境
wx.cloud.init({
  env: 'mycloud-mecqe'
})
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    smbarcode:"6913825649859",
    smname:"测试商品",
    smsupplier:"测试供货商",
    smcategory:"测试类别",
    smspecification:"500g",
    smpurchaseprice:"0.1",
    smsellingprice:"9.9",
    smselfcode:"20200724"
    // smbarcode:"",
    // smname:"",
    // smsupplier:"",
    // smcategory:"",
    // smspecification:"",
    // smpurchaseprice:"",
    // smsellingprice:"",
    // smselfcode:""
  },
  /*扫码辅助填入条形码*/
  onClickIcon(){
      var that = this;
      // 允许从相机和相册扫码
      wx.scanCode({
        success: (res) => {
          wx.vibrateShort();
          var result = res.result;
          that.setData({
            smbarcode:result
          })
        }
      })
  },
  /*提交表单*/
  addbtnSub(res) {
    wx.showLoading({
      title: '数据提交中',
      mask:true
    })
    console.log(res)
    // var barcode=res.detail.value.barcode
    // var name=res.detail.value.name
    // var supplier=res.detail.value.supplier
    // var category=res.detail.value.category
    // var specification=res.detail.value.specification
    // var purchaseprice=res.detail.value.purchaseprice
    // var sellingprice=res.detail.value.sellingprice
    // var selfcode=res.detail.value.selfcode
    var {barcode,name,supplier,category,specification,purchaseprice,sellingprice,selfcode} = res.detail.value;
    // console.log(specification)
    wx.cloud.callFunction({
      name:"goodsAddData",
      data:{
        barcode,
        name,
        supplier,
        category,
        specification,
        purchaseprice,
        sellingprice,
        selfcode:selfcode
      }
    }).then(res => {
      console.log(res)
      //通知栏显示成功消息
      Notify({ type: 'success',duration: 3000, message: '添加商品成功'});
      //提交表单完成后重置表单
      this.setData({
        smbarcode:"",
        smname:"",
        smsupplier:"",
        smcategory:"",
        smspecification:"",
        smpurchaseprice:"",
        smsellingprice:"",
        smselfcode:""
      })
      wx.hideLoading()
    })
  },
  //重置表单
  delbtnSub(){
    this.setData({
      smbarcode:"",
      smname:"",
      smsupplier:"",
      smcategory:"",
      smspecification:"",
      smpurchaseprice:"",
      smsellingprice:"",
      smselfcode:""
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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