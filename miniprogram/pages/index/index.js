// const { barcode, qrcode } = require('../../utils/index.js')
// import { toBarcode, toQrcode } from '../../utils/index';

  /*图表*/
  import * as echarts from '../../ec-canvas/echarts';
  // function initChart(canvas, width, height) {
  //   const chart = echarts.init(canvas, null, {
  //     width: width,
  //     height: height
  //   });
  //   canvas.setChart(chart);
  
  //   var option = {
  //     title: {
  //         // text: '某站点用户访问来源',
  //         // subtext: '纯属虚构',
  //         left: 'center'
  //     },
  //     tooltip: {
  //         trigger: 'item',
  //         formatter: '{b} : {c} ({d}%)'
  //     },
  //     legend: {
  //         orient: 'vertical',
  //         left: 'left',
  //         data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  //     },
  //     series: [
  //         {
  //             name: '访问来源',
  //             type: 'pie',
  //             radius: '55%',
  //             center: ['50%', '50%'],
  //             data: [
  //                 {value: 335, name: '直接访问'},
  //                 {value: 310, name: '邮件营销'},
  //                 {value: 234, name: '联盟广告'},
  //                 {value: 135, name: '视频广告'},
  //                 {value: 1548, name: '搜索引擎'},
  //                 {value: 1548, name: 'hh'}
  //             ],
  //             emphasis: {
  //                 itemStyle: {
  //                     shadowBlur: 10,
  //                     shadowOffsetX: 0,
  //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
  //                 }
  //             }
  //         }
  //     ]
  // };
  //   chart.setOption(option);
  //   return chart;
  // }
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    today:0,//今日销售金额
    //图表
    // ec: {
    //   onInit: initChart
    // },
    ecbt: {//类别饼图销售情况
      // onInit: initChart
      lazyLoad:true//懒加载（有加载动画）
    },
    categoryListData:[],//类别数据
    categoryListName:[],//类别名称
    //查询商品
    goodlist:[],
    //控制显示遮罩层
    show: false,
    //控制图表显示
    tbshow:true,
    //搜索框
    search:"",
    importtime:"-"//导入时间
  },
  /*商品库跳转*/
  goodlist() {
    wx.navigateTo({
      url: '/pages/goodlist/goodlist',
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
    var that = this;
    setTimeout(function(){
      wx.showLoading({
        title: '数据加载中',
        mask:true
      })
      /*振动提示*/
      wx.vibrateShort();
      console.log(that.data.search)
      //非数字，提示用户修改
      if(isNaN(that.data.search)){
        wx.hideLoading()
        Toast('输入内容需为纯数字');
      }else{
        wx.cloud.callFunction({
          name:"goodsGetData",
          data:{
            barcode:that.data.search
          }
        }).then(res=>{
          wx.hideLoading()
          console.log(res)
          if(res.result.data[0]){
            that.setData({
              goodlist:res.result.data[0],
              show:true,
              tbshow:false
            })
          }else{
            //查询结果返回为空，则显示警告
            Toast('查询商品不存在或因未入库');
          }
        })
        .catch(e=>{
          //调用函数失败执行
          console.log('出现了错误',e)
       })
      }
    },1000)
  },
  /*扫码*/
  onClick() {
    var that = this;
    // 允许从相机和相册扫码
    wx.scanCode({})
    .then(res=>{
      //成功后执行
      console.log(res)
      wx.vibrateShort();
        var result = res.result;
        that.setData({
          search:result
        })
        // console.log(res.result)
        wx.cloud.callFunction({
          name:"goodsGetData",
          data:{
            barcode:result
          }
        }).then(res=>{
          // console.log(res)
          if(res.result.data[0]){
            that.setData({
              goodlist:res.result.data[0],
              show:true,
              tbshow:false
            })
            console.log("goodlist:"+goodlist)
          }else{
            //查询结果为空，则提示警告
            Toast('查询商品不存在或因未入库');
          }
        })
        // var scanType = res.scanType;
        // var charSet = res.charSet;
        // var path = res.path;
        // that.setData({
        //   result: result,
        //   scanType: scanType,
        //   charSet: charSet
        // })
    }).catch(e=>{
      //调用函数失败执行
      Toast('出现了错误，请重启相机');
      console.log('出现了错误，请重启相机',e)
   })
  },
  /*入库*/
  addgoodlist(){
    wx.navigateTo({
      url: '/pages/addgoodlist/addgoodlist',
    })
  },
  /*出库*/
  delgoodlist(){
    wx.navigateTo({
      url: '/pages/delgoodlist/delgoodlist',
    })
  },

  //今天销售金额
  sellTodayGetData(){
    wx.cloud.callFunction({
      name:"sellTodayGetData"
    }).then(res=>{
      // console.log(res)
      // console.log(res.result.data[0].price)
      var tempcategoryListData=res.result.data
      // console.log(tempcategoryListData)
      this.data.categoryListData=[]
      this.data.categoryListName=[]
      for(var i = 0 ; i<tempcategoryListData.length ; i++){
        var list={}
        list.value = tempcategoryListData[i].price
        list.name = tempcategoryListData[i].name
        this.data.categoryListData.push(list)
      }
      for(var i = 0 ; i<tempcategoryListData.length ; i++){
        var list= tempcategoryListData[i].name
        this.data.categoryListName.push(list)
      }
      // console.log(this.data.categoryListName)
      // console.log(this.data.categoryListData)
      this.data.today=0
      //遍历数据累加
      for(var i=0;i<res.result.data.length;i++){
        this.data.today = this.data.today + res.result.data[i].price
      }
      this.setData({
        today:this.data.today
      })
      // console.log(this.data.today)
    }).then(res=>{
      // var that=this;
      this.echarCanve = this.selectComponent("#mychart-dom-bar-bt");
      this.initbt();
    })
  },
  initbt:function(){
    this.echarCanve.init((canvas, width, height)=> {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt());
      return chart;
    })    
  },
  getOptionbt:function(){
    var option = {
      title: {
          // text: '今日各类别销售情况',
          // subtext: '今日各类别销售情况数据分析',
          subtext: '各类别销售分布',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: this.data.categoryListName
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.data.categoryListData,
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
    return option;
  },
  /*关闭搜索结果遮罩弹窗*/
  onClose() {
    this.sellTodayGetData()
    this.setData({
      show:false,
      tbshow:true
    });
  },
  // generatBbarcode() {
  //   // this.setData({
  //   //   data: '1'
  //   // })
  //   // console.log(this.data.obj.SecretCode,'产品核销码');
  // //第一个参数是html页面里面canves的id，第二个参数是要转化的那串数字，后面两个参数分别是图片的宽高
  // const code = '1221334122546765342';
 
  // toBarcode('barcode', code, 680, 200);
  // toQrcode('qrcode', code, 420, 420);
  //   // qrcode('qrcode', 123456, 320, 320);
  // },
  /**
   * 销售数据导入时间
   */
  bossGetImportTime(){
    wx.cloud.callFunction({
      name:"bossGetImportTime"
    }).then(res=>{
      // console.log(res.result.list[0].date)
      var temp = (res.result.list[0].date).slice(0,10)
      temp = temp + " " + (res.result.list[0].date).slice(11,19)
      this.setData({
        importtime:temp
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sellTodayGetData()
    this.bossGetImportTime()
    // this.generatBbarcode()
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
    this.bossGetImportTime()
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
      url: '/pages/index/index',
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