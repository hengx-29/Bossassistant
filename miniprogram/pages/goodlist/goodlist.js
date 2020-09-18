// pages/goodlist/goodlist.js
//初始化环境
wx.cloud.init({
  env: 'mycloud-mecqe'
})
//连接数据库
const db = wx.cloud.database()
import { toBarcode, toQrcode } from '../../utils/index';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    search:"",//搜索值
    goodlist:[],//商品列表
    showBarcode:false,//控制点击显示遮罩层，用于展示条形码
    vanempty:false,//控制数据为空，显示图片
    _id:"",//商品id，用于修改更新商品
    idx:"",//每次商品列表的下标
    show: false,//控制商品详情弹窗显示去修改
    instance:"",//是否还原滑动块
    smbarcode:"",
    smname:"",
    smsupplier:"",
    smcategory:"",
    smspecification:"",
    smpurchaseprice:"",
    smsellingprice:"",
    smselfcode:"",
    count:"-",//数据记录数
    categoryCount:"-"//商品类别数据记录数
  },
  /*获取所有商品，生成数组列表在页面渲染*/
  goodsGetData(num=6,page=0){
    wx.cloud.callFunction({
      name:"goodsGetData",
      data:{
        num:num,
        page:page,
      }
    }).then(res=>{
      // console.log(res)
      var oldData = this.data.goodlist
      var newData = oldData.concat(res.result.data)
      console.log("拼接的数据"+res.result.data)
      console.log("新数据"+newData)
      this.setData({
        goodlist:newData
      })
      console.log(this.data.goodlist)
    })
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
            goodlist:res.result.data
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
      })
      .catch(e=>{
        //调用函数失败执行
        Toast('出现了错误，请重启相机');
        console.log('出现了错误，请重启相机',e)
     })

  },
  /*监听搜索输入框的值*/
  onChange(event){
    console.log(event.detail)
    this.setData({
      search:event.detail
    })
  },
  /*输入框搜索商品*/
  onSearch(){
    var that = this;
    //延时执行，防止获取输入框值不对应
    setTimeout(function(){
      /*振动提示*/
      wx.vibrateShort();
      wx.showLoading({
        title: '数据加载中',
        mask:true
      })
      console.log(that.data.search)
      /*模糊查询*/
      wx.cloud.callFunction({
        name:"goodsBlurGetData",
        data:{
          search:that.data.search
        }
      }).then(res=>{
        that.setData({
          goodlist:res.result.data
        })
        wx.hideLoading()
        if(that.data.goodlist.length==0){
          // console.log("空数组")
          //空数组
          that.setData({
            vanempty:true
          })
        }else{
          that.setData({
            vanempty:false
          })
        }
      })
    },1000)
  },
  //修改条形码，点击。。。相机辅助扫描
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
  /*每个商品的详情事件，用于修改商品*/
  onClose(event) {
    console.log(event)
    var id =event.currentTarget.dataset.id;
    var idx =event.currentTarget.dataset.idx;
    this.setData({
      _id:id,
      idx:idx
    })
    // var barcode = this.data.goodlist[this.data.idx].barcode
    // console.log(barcode)
    console.log(id)
    const { position, instance} = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        this.setData({
          show:true,
          smbarcode:this.data.goodlist[this.data.idx].barcode,
          smname:this.data.goodlist[this.data.idx].name,
          smsupplier:this.data.goodlist[this.data.idx].supplier,
          smcategory:this.data.goodlist[this.data.idx].category,
          smspecification:this.data.goodlist[this.data.idx].specification,
          smpurchaseprice:this.data.goodlist[this.data.idx].purchaseprice,
          smsellingprice:this.data.goodlist[this.data.idx].sellingprice,
          smselfcode:this.data.goodlist[this.data.idx].selfcode,
        })
        instance.close();
        // Dialog.confirm({
        //   message: '确定修改吗？',
        // }).then(() => {
        //   instance.close();
        // }).catch(() => {
        //   // on cancel
        // });
        break;
    }
  },
  //确定修改弹窗按钮
  updategoodlist(res){
    wx.showLoading({
      title: '正在修改',
      mask:true
    })
    // var {barcode,name,supplier,category,specification,purchaseprice,sellingprice,selfcode} = res.detail.value;
    console.log("执行updategoodlist")
    // console.log("第几个商品",this.data.idx+1)
    // console.log(this.data.goodlist[this.data.idx].barcode)
    console.log(this.data.smbarcode)
    console.log(this.data._id)
    //解构赋值
    var {barcode,name,supplier,category,specification,purchaseprice,sellingprice,selfcode} = res.detail.value;
    wx.cloud.callFunction({
      name:"goodsUpdateData",
      data:{
        id:this.data._id,
        barcode,
        name,
        supplier,
        category,
        specification,
        purchaseprice,
        sellingprice,
        selfcode
      }
    }).then(res => {
      console.log(res)
      this.setData({
        show:false
      })
      wx.hideLoading()
      //通知栏显示成功消息
      Notify({ type: 'success',duration: 3000, message: '修改商品成功'});
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
    })
  },
  //取消修改弹窗按钮
  dialogOnClose(){
    console.log("关闭弹窗")
  },
  /**
   * 显示遮罩层，生成条形码
   */
  generatBbarcode(e){
    this.setData({
      showBarcode:true
    })
    console.log(e)
    console.log(e.currentTarget.dataset.idx)
    var id = e.currentTarget.dataset.idx
    this.setData({
      smbarcode:this.data.goodlist[id].barcode,
      smname:this.data.goodlist[id].name,
      smsupplier:this.data.goodlist[id].supplier,
      smcategory:this.data.goodlist[id].category,
      smspecification:this.data.goodlist[id].specification,
      smpurchaseprice:this.data.goodlist[id].purchaseprice,
      smsellingprice:this.data.goodlist[id].sellingprice,
      smselfcode:this.data.goodlist[id].selfcode,
    })
    console.log(this.data.goodlist[id].barcode)
    // toBarcode('barcode', '6921168509256', 300, 65);
    toBarcode('barcode', this.data.goodlist[id].barcode, 300, 65);
    // toQrcode('qrcode', e.currentTarget.dataset.barcode, 420, 420);
  },
  //关闭条形码遮罩层
  onCloseBarcode(){
    this.setData({
      showBarcode:false
    })
  },
  //长按打印
  printBbarcode(e){
    console.log(e)
  },
  //获取数据条数
  goodsGetCount(){
    wx.cloud.callFunction({
      name:"goodsGetCount"
    }).then(res=>{
      console.log("数据条数")
      console.log(res)
      this.setData({
        count:res.result.total
      })
    })
  },
  //获取商品类别条数
  goodsCategoryGetCount(){
    wx.cloud.callFunction({
      name:"goodsCategoryGetCount"
    }).then(res=>{
      console.log("类别数据条数")
      console.log(res)
      this.setData({
        categoryCount:res.result.list[0].categories.length
      })
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
    /*执行默认num为6，页数为1*/
    this.goodsGetData()
    this.goodsGetCount()
    this.goodsCategoryGetCount()
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
      url: '/pages/goodlist/goodlist',
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var page=this.data.goodlist.length
    this.goodsGetData(6,page)
    setTimeout(function(){
      wx.hideLoading({
        complete: (res) => {},
      })
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})