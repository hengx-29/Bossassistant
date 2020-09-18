// pages/delgoodlist/delgoodlist.js
//初始化环境
wx.cloud.init({
  env: 'mycloud-mecqe'
})
//连接数据库
const db = wx.cloud.database()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //搜索内容
    search:"",
    //商品列表
    goodlist:[],
    //控制搜索商品为空而显示页面
    vanempty:false,
    //控制搜索标题文字显示
    vansearchtitle:false,
    //商品_id用于删除商品
    _id:""
  },
  /*扫码辅助填入条形码*/
  onClick(){
    var that = this;
    // 允许从相机和相册扫码
    wx.scanCode({})
      .then(res=>{
        wx.vibrateShort();
        wx.showLoading({
          title: '数据加载中',
          mask:true
        })
        var result = res.result;
        that.setData({
          search:result
        })
        /*条形码查询*/
        wx.cloud.callFunction({
          name:"goodsGetData",
          data:{
            barcode:this.data.search
          }
        }).then(res=>{
          // console.log(res)
          this.setData({
            goodlist:res.result.data,
            vansearchtitle:true
          })
          wx.hideLoading()
          if(this.data.goodlist.length==0){
            //空数组
            this.setData({
              vanempty:true
            })
          }else{
            this.setData({
              vanempty:false
            })
          }
        })
      })
      .catch(e=>{
        //调用函数失败执行
        console.log('出现了错误',e)
     })
  },
  /*监听搜索输入框的值*/
  onChange(event){
    // console.log(event.detail)
    this.setData({
      search:event.detail
    })
  },
  /*输入框搜索商品*/
  onSearch(){
    /*振动提示*/
    wx.vibrateShort();
    wx.showLoading({
      title: '数据加载中',
      mask:true
    })
    var that = this;
    console.log(this.data.search)
    /*模糊查询*/
    wx.cloud.callFunction({
      name:"goodsBlurGetData",
      data:{
        search:this.data.search
      }
    }).then(res=>{
      // console.log(res)
      that.setData({
        goodlist:res.result.data,
        vansearchtitle:true
      })
      wx.hideLoading()
      if(this.data.goodlist.length==0){
        // console.log("空数组")
        //空数组
        this.setData({
          vanempty:true
        })
      }else{
        this.setData({
          vanempty:false
        })
      }
    })
    //   wx.cloud.callFunction({
    //     name:"goodsGetData",
    //     data:{
    //       barcode:this.data.search
    //     }
    //   }).then(res=>{
    //     console.log(res)
    //     if(res.result.data[0]){
    //       that.setData({
    //         goodlist:res.result.data[0],
    //         show:true
    //       })
    //     }else{
    //       //查询结果返回为空，则显示警告
    //       Toast('查询商品不存在或因未入库');
    //     }
    //   }).catch(e=>{
    //     //调用函数失败执行
    //     console.log('出现了错误',e)
    //  })
  },
  /*每个商品的详情事件，用于删除商品*/
  onClose(event) {
    console.log(event)
    var id =event.currentTarget.dataset.id;
    this.setData({
      _id:id
    })
    console.log(id)
    const { position, instance} = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          wx.showLoading({
            title: '正在删除',
            mask:true
          })
          wx.cloud.callFunction({
            name:"goodsDelData",
            data:{
              id:this.data._id
            }
          }).then(res=>{
            console.log(res)
            console.log("删除成功")
            Notify({ type: 'success',duration: 3000, message: '删除商品成功'});
            //检测刷新页面
            db.collection("boss-good-list").watch({
              onChange:res=>{
                console.log(res.docs)
                this.setData({
                  goodlist:res.docs
                })
              },
              onError:err => {
                console.log(err)
              },
            })
            wx.hideLoading()
          })
          instance.close();
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // var that = this;
    wx.redirectTo({
      //加载页面地址
      url: '/pages/delgoodlist/delgoodlist',
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