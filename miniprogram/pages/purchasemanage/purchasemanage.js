// pages/purchasemanage/purchasemanage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputLists:[],
    _id:"",//商品id，用于修改更新商品
    idx:"",//每次商品列表的下标
    showDialog: false,//控制商品详情弹窗显示去修改
  },
  /**
   * 获取采购单数据
   */
  purchaseGetData(){
    wx.cloud.callFunction({
      name:"purchaseGetData"
    }).then(res=>{
      console.log("获取到采购单数据")
      for(var i = 0 ; i<res.result.list.length;i++){
        res.result.list[i].time=this.timestampToTime(res.result.list[i].time)
      }
      this.setData({
        inputLists:res.result.list
      })

      console.log(res)
    })
  },
  /**
   * 选择返回
   */
  selectBack(e){
    console.log(e)
    var id = e.currentTarget.dataset.idx
    console.log(e.currentTarget.dataset.idx)
    console.log("点击获取到的列表信息，准备通过页面传值")
    console.log(this.data.inputLists[id].inputList)
    wx.navigateBack({
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      inputList: this.data.inputLists[id].inputList
    })
  },
  /**
   * 时间转换
   */
  timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate()+ ' ';
    var h = date.getHours()<10? '0'+date.getHours()+ ':' : date.getHours()+':';
    var m = date.getMinutes()<10? '0'+date.getMinutes()+ ':' : date.getMinutes()+':';
    var s = date.getSeconds()<10? '0'+date.getSeconds() : date.getSeconds();
    return Y+M+D+h+m+s;
  },
  /*每个采购单的详情事件，用于删除*/
  onClose(event) {
    console.log(event)
    var id =event.currentTarget.dataset.id;
    var idx =event.currentTarget.dataset.idx;
    this.setData({
      id:id,
      idx:idx
    })
    console.log("商品自带",id)
    console.log("下标",idx)
    const { position, instance} = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        this.setData({
          showDialog:true
        })
        instance.close();
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          wx.showLoading({
            title: '数据提交中',
            mask:true
          })
          instance.close();
          wx.cloud.callFunction({
            name:"purchaseDelData",
            data:{
              id:id
            }
          }).then(res=>{
            console.log("删除成功",idx)
            console.log(res)
          })
          //删除当前下标的数组数据，并返回新数组
          this.data.inputLists.splice(idx,1)
          this.setData({
            inputLists:this.data.inputLists
          })
          Notify({ type: 'success',duration: 3000, message: '删除采购单成功'});
          wx.hideLoading({
            complete: (res) => {},
          })
        }).catch(() => {
          // on cancel
        });
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取采购单数据
    this.purchaseGetData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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