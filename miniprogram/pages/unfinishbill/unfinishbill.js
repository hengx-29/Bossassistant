// pages/unfinishbill/unfinishbill.js
//初始化环境
wx.cloud.init({
  env: 'mycloud-mecqe'
})
//连接数据库
const db = wx.cloud.database()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    billlist:[],//账单列表
    show:false,//控制显示修改弹窗
    id:" ",//记录账单唯一id
    idx:" ",//账单序号
    supplier:" ",//账单供货商
    selfcode:" ",//账单供货商编号
    status:" ",//账单状态-已结算/未结算
    time:" ",//账单时间
    price:" ",//账单金额
    salesman:" ",//账单业务员
    phone:" ",//账单联系电话
  },
  /**
   * 时间转换
   */
  timestampToTime(timestamp) {
    //读取的字符串型转数字型
    var date = new Date(Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    // console.log(date)
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate()+ ' ';
    var h = date.getHours()<10? '0'+date.getHours()+ ':' : date.getHours()+':';
    var m = date.getMinutes()<10? '0'+date.getMinutes()+ ':' : date.getMinutes()+':';
    var s = date.getSeconds()<10? '0'+date.getSeconds() : date.getSeconds();
    return Y+M+D+h+m+s;
  },
  /**
   * 获取全部账单+未结算
   */
  getUnfinishbill(){
    //全部账单和未结算
    wx.cloud.callFunction({
      name:"billGetData",
      data:{
        status:"0"
      }
    }).then(res=>{
      // console.log(res)
      for(var i = 0 ; i<res.result.data.length;i++){
        res.result.data[i].time=this.timestampToTime(res.result.data[i].time)
      }
      this.setData({
        billlist:res.result.data
      })
    })
  },
  //修改账单状态-已结算/未结算
  updateStatus(e){
    Dialog.confirm({
      title: '提示',
      message: '是否更改状态',
    })
      .then(() => {
        // on confirm确定
        // console.log(e)
        wx.showLoading({
          title: '正在提交',
          mask:true
        })
        var billlist =this.data.billlist;
        // console.log(e.currentTarget.dataset.idx)
        //判断状态取反
        if(billlist[e.currentTarget.dataset.idx].status=="0"){
          // console.log("0")
          billlist[e.currentTarget.dataset.idx].status = "1";
        }else if(billlist[e.currentTarget.dataset.idx].status=="1"){
          billlist[e.currentTarget.dataset.idx].status = "0";
        }
        wx.cloud.callFunction({
          name:"billUpdateData",
          data:{
            id:e.currentTarget.dataset.id,
            status:billlist[e.currentTarget.dataset.idx].status
          }
        }).then(res=>{
          // console.log(res)
          this.setData({
            billlist:billlist
          })
          wx.hideLoading();
        })
      })
      .catch(() => {
        // on cancel取消
      });
  },
  /*每个账单的详情事件，显示账单然后修改*/
  onClose(event) {
    // console.log(event)
    var id =event.currentTarget.dataset.id;
    var idx =event.currentTarget.dataset.idx;
    this.setData({
      id:id,
      idx:idx
    })
    const { position, instance} = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        var tempstatus = " "
        if(this.data.billlist[idx].status=="0"){
          tempstatus="未结算"
        }else if(this.data.billlist[idx].status=="1"){
          tempstatus="已结算"
        }else{
          tempstatus=" "
        }
        this.setData({
          show:true,
          supplier:this.data.billlist[idx].supplier,
          price:this.data.billlist[idx].price,
          selfcode:this.data.billlist[idx].selfcode,
          time:this.data.billlist[idx].time,
          salesman:this.data.billlist[idx].salesman,
          phone:this.data.billlist[idx].phone,
          status:tempstatus
        })
        //关闭滑块
        instance.close();
        break;
    }
  },
  //确定修改弹窗按钮
  updatebilllist(res){
    // console.log(res)
    wx.showLoading({
      title: '正在修改',
      mask:true
    })
    //解构赋值
    var {supplier,selfcode,price,salesman,phone} = res.detail.value;
    var tempstatus = res.detail.value.status
    if(tempstatus=="已结算"){
      tempstatus="1"
    }else if(tempstatus=="未结算"){
      tempstatus="0"
    }else{
      tempstatus=" "
    }
    var temptime = new Date(res.detail.value.time).getTime().toString();
    // console.log(temptime)
    //调用更新账单云函数
    wx.cloud.callFunction({
      name:"billUpdateData",
      data:{
        id:this.data.id,
        supplier,
        selfcode,
        status:tempstatus,
        time:temptime,
        price,
        salesman,
        phone
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        show:false
      })
      wx.hideLoading()
      //通知栏显示成功消息
      Notify({ type: 'success',duration: 3000, message: '修改账单成功'});
      //检测刷新页面
      db.collection("boss-billdata").watch({
        onChange:res=>{
          // console.log(res)
          // console.log(res.docs)
          //循环格式化更新数据中的时间
          for(var i = 0 ; i<res.docs.length;i++){
            res.docs[i].time=this.timestampToTime(res.docs[i].time)
          }
          this.setData({
            billlist:res.docs
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
    // console.log("关闭修改弹窗")
    this.setData({
      show:false
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