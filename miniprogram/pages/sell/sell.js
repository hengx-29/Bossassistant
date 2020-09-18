// pages/sell/sell.js
//初始化环境
wx.cloud.init({
  env: 'mycloud-mecqe'
})
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import * as echarts from '../../ec-canvas/echarts';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    today:0,//今天销售金额
    yesterday:0,//昨天销售金额
    compare:3,//今天昨天的数据比较
    thisMonth:0,//本月销售金额
    turnover:0,//营业额
    TargetTurnover:0,//目标营业额
    gradientColor: {//达标营业额样式
      '0%': '#70DBFF',
      '100%': '#7109aa',
    },
    CategoryTarget: 0,//达标类别
    categoryGoodsCount:0,//商品库的类别总数目
    sellCategoryGetCount:0,//今日销售商品类别
    gradientColor2: {//达标类别样式
      '0%': '#A0F1EA',
      '100%': '#EF96C5',
    },
    ecbt: {//类别饼图销售情况
      // onInit: initChart
      lazyLoad:true//懒加载（有加载动画）
    },
    categoryListData:[],//类别数据
    categoryListName:[],//类别名称
    eczx: {//近七天销售情况
      // onInit: onitChart
      lazyLoad:true
    },
    sevenListData:[],//近七天数据
    sevenListName:[],//近七天名称
    eczxtwo: {//近一个月（30天）销售情况
      lazyLoad:true
    },
    monthListDatatwo:[],//近一个月（30天）数据
    monthListNametwo:[],//近一个月名称
    importtime:"-",//导入时间
    checked: true,//开关
  },
  onChange(event) {
    // console.log(event)
    wx.showToast({
      title: `切换到${event.detail.title}`,
      icon: 'none',
    });
    if(event.detail.index==1){
      this.echarCanve = this.selectComponent("#mychart-dom-bar-zxtwo");
      this.initzxtwo();
    }else if(event.detail.index==0){
      this.echarCanve = this.selectComponent("#mychart-dom-bar-zx");
      this.initzx();
    }else{
      wx.showToast({
        title: "出错了，请刷新页面",
        icon: 'none',
      });
    }
  },
  //今天销售金额
  sellTodayGetData(){
    var that = this
    wx.cloud.callFunction({
      name:"sellTodayGetData"
    }).then(res=>{
      // console.log(res)
      // console.log(res.result.data[0].price)
      var tempcategoryListData=res.result.data
      // console.log(tempcategoryListData)
      for(var i = 0 ; i<tempcategoryListData.length ; i++){
        // var list={
        //   id:tempcategoryListData[0].idx,
        //   value:tempcategoryListData[tempcategoryListData[0].idx-1].price,
        //   name:tempcategoryListData[tempcategoryListData[0].idx-1].name
        // }
        var list={}
        // list.id = tempcategoryListData[i].idx
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
      //遍历数据累加
      for(var i=0;i<res.result.data.length;i++){
        this.data.today = this.data.today + res.result.data[i].price
      }
      this.setData({
        today:this.data.today,
      })
      // console.log(this.data.today)
      // new Promise(       //创建Promise实例
      //     // 执行器exector
      //     function (resolve, reject){
      //         //一段耗时很长的异步操作
      //         resolve();        // 数据处理完成
      //         reject();         // 数据处理出错
      //     }
      // )
    })
    .then(res=>{
      this.echarCanve = this.selectComponent("#mychart-dom-bar-bt");
      this.initbt();
      this.bossGetSet()
      this.sellYesterdayGetData()
    })
    .then(res=>{
      this.compare()
      // console.log(this.data.TargetTurnover)
    })
  },
  //获取目标营业额
  bossGetSet(){
    wx.cloud.callFunction({
      name:"bossGetSet"
    }).then(res=>{
      // console.log(res)
      this.setData({
        TargetTurnover:Number(res.result.data.TargetTurnover)
      })
      // console.log(this.data.TargetTurnover)
      // console.log(typeof(Number(this.data.TargetTurnover)))
      // console.log(this.data.today)
      // console.log(this.data.TargetTurnover)
      // console.log(parseFloat(this.data.today)/parseFloat(this.data.TargetTurnover))
      //计算营业额达标率--百分比
      this.data.turnover = (parseFloat(this.data.today)/parseFloat(this.data.TargetTurnover) > 1 ? 1.00 : parseFloat(this.data.today)/parseFloat(this.data.TargetTurnover)).toFixed(2)*100
      this.setData({
        turnover:this.data.turnover
      })
    })
  },

  //昨天销售金额
  sellYesterdayGetData(){
    wx.cloud.callFunction({
      name:"sellYesterdayGetData"
    }).then(res=>{
      // console.log(res)
      // console.log(res.result.data[0].date.toString().substr(0,10))
      //遍历数据累加
      for(var i=0;i<res.result.data.length;i++){
        this.data.yesterday = this.data.yesterday + res.result.data[i].price
      }
      // console.log(this.data.today)
      this.setData({
        yesterday:this.data.yesterday
      })
    })
  },
  /*今天与昨天销售数据比较*/
  compare(){
    if(this.data.today>this.data.yesterday){
      this.setData({
        compare:1
      })
    }else{
      this.setData({
        compare:0
      })
    }
    
    // if(this.data.today==0 || this.data.yesterday==0){
    //   new Promise(       //创建Promise实例
    //     // 执行器exector
    //     function (resolve, reject){
    //         //一段耗时很长的异步操作
    //         resolve();        // 数据处理完成
    //         reject();         // 数据处理出错
    //     }
    // )
    // .then(res=>{
    //   // that.sellYesterdayGetData()
    //   // that.sellTodayGetData()
    //   setTimeout(function(){
    //     console.log("比较中",that.data.today)
    //     console.log("比较中",that.data.yesterday)
    //     if(that.data.today>that.data.yesterday){
    //       that.setData({
    //         compare:1
    //       })
    //     }else{
    //       that.setData({
    //         compare:0
    //       })
    //     }
    //   },2000)
    // })
    // .catch(res=>{
    //   console.log("今天和昨天的数据没有比较成功")
    // });
    // }else{
    //   if(that.data.today>that.data.yesterday){
    //     that.setData({
    //       compare:1
    //     })
    //   }else{
    //     that.setData({
    //       compare:0
    //     })
    //   }
    //   console.log("未获取到今天和昨天的对比数据")
    // }

  },
  //本月销售金额
  sellThisMonthGetData(){
    wx.cloud.callFunction({
      name:"sellThisMonthGetData"
    }).then(res=>{
      // console.log(res)
      //遍历数据累加
      for(var i=0;i<res.result.data.length;i++){
        this.data.thisMonth = this.data.thisMonth + res.result.data[i].price
      }
      // console.log(this.data.today)
      this.setData({
        thisMonth:this.data.thisMonth
      })
    })
  },
  /**
   * 饼图
  */
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
          text: '今日各类别销售分布',
          subtext: '数据解析',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
      },
      legend: {
          left: 'center',
          top: 'bottom',
          data: this.data.categoryListName
      },
      // toolbox: {
      //     show: true,
      //     feature: {
      //         mark: {show: true},
      //         dataView: {show: true, readOnly: false},
      //         magicType: {
      //             show: true,
      //             type: ['pie', 'funnel']
      //         },
      //         restore: {show: true},
      //         saveAsImage: {show: true}
      //     }
      // },
      series: [
          {
              name: '面积模式',
              type: 'pie',
              radius: [30, 110],
              center: ['50%', '50%'],
              roseType: 'area',
              data: this.data.categoryListData,
          }
      ]
  };
  //   var option = {
  //     title: {
  //         text: '今日各类别销售情况',
  //         subtext: '数据分析',
  //         left: 'center'
  //     },
  //     tooltip: {
  //         trigger: 'item',
  //         formatter: '{b} : {c} ({d}%)'
  //     },
  //     legend: {
  //         orient: 'vertical',
  //         left: 'left',
  //         data: this.data.categoryListName
  //     },
  //     series: [
  //         {
  //             name: '访问来源',
  //             type: 'pie',
  //             radius: '55%',
  //             center: ['50%', '60%'],
  //             data: this.data.categoryListData,
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
    return option;
  },
  //近七天折线图
  initzx:function(){
    this.echarCanve.init((canvas, width, height)=> {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionzx());
      return chart;
    })    
  },
  getOptionzx:function(){
    var option = {
      xAxis: {
          type: 'category',
          data: this.data.sevenListName
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: this.data.sevenListData,
          type: 'line',
          smooth: true
      }]
  };  
    return option;
  },
  //近一个月
  initzxtwo:function(){
    this.echarCanve.init((canvas, width, height)=> {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionzxtwo());
      return chart;
    })    
  },
  getOptionzxtwo:function(){
    var option = {
      xAxis: {
          type: 'category',
          data: this.data.monthListNametwo
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: this.data.monthListDatatwo,
          type: 'line',
          smooth: true
      }]
  };  
    return option;
  },
  //近七天销售情况
  sellBeforeSevenGetdata(){
    wx.cloud.callFunction({
      name:"sellBeforeSevenGetdata"
    }).then(res=>{
      // console.log("近七天")
      // console.log(res)
      for(var i=0;i<res.result.list.length;i++){
        this.data.sevenListName.push(res.result.list[i]._id)
        this.data.sevenListData.push(res.result.list[i].price)
      }
      this.setData({
        sevenListName:this.data.sevenListName,
        sevenListData:this.data.sevenListData
      })
    }).then(res=>{
      this.echarCanve = this.selectComponent("#mychart-dom-bar-zx");
      this.initzx();
    })
  },
  // 第一种console.log(res.result.data[0].date.toString().substr(0,10))
  // 第二种for循环-*n 添加数组
  //var time=(new Date).getTime()-24*60*60*1000;
  //var yesterday=new Date(time).toLocaleDateString();
  //近二十天销售情况---一个月
  sellBeforeMonthGetData(){
    wx.cloud.callFunction({
      name:"sellBeforeMonthGetData"
    }).then(res=>{
      // console.log("近一个月")
      // console.log(res)
      for(var i=0;i<res.result.list.length;i++){
        this.data.monthListNametwo.push(res.result.list[i]._id)
        this.data.monthListDatatwo.push(res.result.list[i].price)
      }
      this.setData({
        monthListNametwo:this.data.monthListNametwo,
        monthListDatatwo:this.data.monthListDatatwo
      })
    }).then(res=>{
      this.echarCanve = this.selectComponent("#mychart-dom-bar-zxtwo");
      this.initzxtwo();
    })
  },
  /**
   * promise all异步改同步执行-计算销售商品类别达标率
   */
  promiselist(){
    let wake1 = new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name:"goodsCategoryGetCount"
      }).then(res=>{
        this.setData({
          categoryGoodsCount:res.result.list[0].categories.length
        })
        resolve(res);
      })
    });
    let wake2 = new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name:"sellCategoryGetCount"
      }).then(res=>{
          this.setData({
            sellCategoryGetCount:parseFloat(res.result.list[0].categories.length)
          })
        resolve(res);
      })
    });
    //按照wake1,wake2顺序执行
    Promise.all([wake1, wake2])
      .then((result) => {
        //计算销售商品类别达标率
        this.data.CategoryTarget = (parseFloat(this.data.sellCategoryGetCount)/parseFloat(this.data.categoryGoodsCount)).toFixed(2)*100
        this.setData({
          CategoryTarget:this.data.CategoryTarget
        })
        // console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  },
    /**
   * 销售数据导入时间
   */
  bossGetImportTime(){
    wx.cloud.callFunction({
      name:"bossGetImportTime"
    }).then(res=>{
      console.log("数据最近更新时间：",res.result.list[0].date)
      var temp = (res.result.list[0].date).slice(0,10)
      temp = temp + " " + (res.result.list[0].date).slice(11,19)
      this.setData({
        importtime:temp
      })
    })
  },
  /**
   * AI数据分析
   */
  AI(){
    Dialog.alert({
      title: 'AI数据分析',
      message: '大数据解析系统正在加急开发中。。。',
    }).then(() => {
      // on close
    });
  },
  /*开关，某些功能正在开发中*/
  turnOnChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    this.bossGetImportTime()
    // this.bossGetSet()
    this.promiselist()//
    // this.goodsCategoryGetCount()
    // this.sellYesterdayGetData()
    this.sellTodayGetData()
    // async function f5() {
    //   var sell1 = await new Promise((resolve, reject) => {
    //       resolve("sellTodayGetData");
    //       // this.sellTodayGetData();
    //   });
    //   var sell2 = await new Promise((resolve, reject) => {
    //       resolve("sellYesterdayGetData");
    //       // this.sellYesterdayGetData();
    //   });
    //   // var sell2 = await sellYesterdayGetData();
    //   //阻塞
    //   console.log("准备比较");
    //   console.log(sell2)
    //   console.log(sell1)
    //   console.log("获取今天昨天数据完成，开始比较")
    // }
    // f5();
    this.sellThisMonthGetData()
    this.sellBeforeSevenGetdata()
    this.sellBeforeMonthGetData()
    // this.sellCategoryGetCount()
    // setTimeout(()=>{
    //   this.compare()
    // },2000)


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
    // this.setData({
    //   TargetTurnover:app.globalData.TargetTurnover
    // })
    // console.log("全局变量目标营业额：",app.globalData.TargetTurnover)
    this.bossGetSet()
    this.bossGetImportTime()
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
 // 显示顶部刷新图标
 wx.showNavigationBarLoading();
 // var that = this;
//  this.bossGetSet()
//  this.sellTodayGetData()
 wx.reLaunch({
   url: '/pages/sell/sell',
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