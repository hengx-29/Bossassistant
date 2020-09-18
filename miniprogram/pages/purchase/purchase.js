// pages/purchase/purchase.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var util = require('../../utils/util.js');
import * as zksdk from '../../utils/bluetoolth';
const app = getApp()
const errMsg = {
  10000: '未初始化蓝牙模块',
  10001: '蓝牙未打开',
  10002: '没有找到指定设备',
  10003: '连接失败',
  10004: '没有找到指定服务',
  10005: '没有找到指定特征值',
  10006: '当前连接已断开',
  10007: '当前特征值不支持此操作',
  10008: '系统上报异常',
  10009: '系统版本低于 4.3 不支持BLE'
};
var scancount=0;//搜索蓝牙设备记录数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    printTitle:'-',
    logs: [],
    list:[],  
    mydeviceList: [],  
    deviceName: '',
    deviceId: '',
    rssi:'-95',
    msg:'',
    BTName:'',
    buletoothConnect:false,//控制蓝牙是否开启状态图片显示
    show:false,//控制显示蓝牙扫描
    // dataList:[1,2],
    //输入框列表
    inputList:  [{
      // 测试用例
      ghsValue:"超市助手",//供货商输入值
      barCode:6902083898649,//条形码输入值
      value:1,//步进器数值
      purchaseValue:3.2,//进价输入值
      // purchase:0,
      goodName:"娃哈哈莲子八宝粥",//商品名称
      specification:"280g",//规格
      sell:3.2//小计计算值
      // ghsValue:null,//供货商输入值
      // barCode:null,//条形码输入值
      // value:1,//步进器数值
      // purchaseValue:null,//进价输入值
      // // purchase:0,
      // goodName:null,//商品名称
      // specification:null,//规格
      // sell:0//小计计算值
    }],
    // value:1,//步进器
    sumNum:0,//合计数量
    sumPrice:0,//合计金额
    purchaseDataCount:0,//采购单数量

    // deviceId: '',
    name: '',
    services: [],
    serviceId: '', 
    writeId:'',
    readId:'',
    SERVERMAINSERVER:'',
    WRITEMAINSERVER:'',
    btn_disabled: true,
    // result:'' ,
    State:'',
    Dev_mac:''
  },
  //增加按钮
  addmore(e) {
    console.log("增加")
    console.log(e)
    //简写变量书写
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    //splice方法来添加对象
    //第一个参数是开始的下标，第二个参数是零为添加操作，第三个参数是添加的内容
    inputList.splice(index, 0, {ghsValue:this.data.ghsValue,value:1,purchaseValue:null,sell:0})
    //更新列表
    this.setData({
      inputList
    })
    // Toast.loading({ forbidClick: true });

    // setTimeout(() => {
    //   Toast.clear();
    //   this.setData({ value:1 });
    // }, 500);
  },
  //删除按钮
  delmore(e){
    console.log("减少")
    console.log(e)
    //简化变量书写
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log("删除下标index"+index)
    // var tempvalue = inputList[index-1].value
    // console.log("tempvalue"+tempvalue)
    // console.log(index)
    if(index==1){
      Dialog.alert({
        title: '提示',
        message: '已经是第一个，无法删除！',
      }).then(() => {
        // on close
      });
    }else{
      Dialog.confirm({
        title: '提示',
        message: '是否删除',
      })
      .then(() => {
        // on confirm
        //splice方法第一个参数为下标，第二个参数不为零，就删除指定个
        inputList.splice(index-1,1)
        // console.log(inputList)
        //更新列表
        this.setData({
          inputList:inputList
        })
      })
      .catch(() => {
        // on cancel
      });
    }

    //小bug删除后，步进器还是显示的删除当前的数值，要替换
    // inputList[index-1].value = tempvalue
    // Toast.loading({ forbidClick: true });

    // setTimeout(() => {
    //   Toast.clear();
    //   this.setData({ value:tempvalue });
    // }, 500);

  },
  //输入供货商
  inpGhs(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log(index)
    //获取到输入框的值
    console.log("输入的值："+e.detail.value)
    //将值赋值给inputList存储起来
    inputList[index-1].ghsValue=e.detail.value
    //将获取的值更新到页面并更新列表
    this.setData({
      ghsValue:e.detail.value,
      inputList:inputList
    })
    console.log(this.data.ghsValue)
  },
  /*扫码辅助填入条形码*/
  onClickIcon(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    var that = this;
    // 允许从相机和相册扫码
    wx.scanCode({}).then(res=>{
      var barCode = res.result;
      console.log(barCode)
      wx.cloud.callFunction({
        name:"goodsGetData",
        data:{
          barcode:barCode,
        }
      }).then(res=>{
        wx.vibrateShort();
        console.log(res)
        if(res.result.data.length==0){
          //将获取的输入值赋值给inputList存储起来
          inputList[index-1].barCode=barCode
          Notify({ type: 'warning',duration: 3000, message: '添加失败,请先入库'});
          //更新列表
          this.setData({
            inputList:inputList
          })
        }else{
          inputList[index-1].ghsValue=res.result.data[0].supplier
          inputList[index-1].barCode=res.result.data[0].barcode
          inputList[index-1].purchaseValue=res.result.data[0].purchaseprice
          inputList[index-1].goodName=res.result.data[0].name
          inputList[index-1].specification=res.result.data[0].specification
          inputList[index-1].sell=res.result.data[0].purchaseprice
          inputList[index-1].value=1
          Notify({ type: 'success',duration: 3000, message: '添加成功'});
          //更新列表
          this.setData({
            inputList:inputList
          })
        }
      })
    })
  },
  //输入条形码
  inpBarcode(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log(index)
    //获取输入的值
    console.log("输入的值："+e.detail.value)
    //将获取的输入值赋值给inputList存储起来
    inputList[index-1].barCode=e.detail.value
    //更新列表
    this.setData({
      inputList:inputList
    })
    console.log("条形码",inputList[index-1].barCode)
  },
  //步进器改变事件
  numOnChange(e){
    console.log(e)
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    //e.detail步进器的值
    console.log(e.detail)
    Toast.loading({ forbidClick: true });

    setTimeout(() => {
      Toast.clear();
      this.setData({ value:e.detail });
    }, 200);
  
    //计算值=数量*进价
    console.log("index"+index)
    console.log(this.data.inputList[index-1].sell)
    //计算的小计赋值给inputList存储起来
    var temp= 0
    if(inputList[index-1].purchaseValue==null){
      inputList[index-1].sell=(Number(e.detail)*temp).toFixed(2)
    }else{
      inputList[index-1].sell=(Number(e.detail)*parseFloat(inputList[index-1].purchaseValue)).toFixed(2)
    }
    //数量赋值给inputList存储起来
    inputList[index-1].value=Number(e.detail)
    //更新列表
    this.setData({
      inputList
    })
  },
  //输入进价事件
  inpPurchase(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log(index)
    //获取输入的值
    console.log("输入的值："+e.detail.value)
    //将获取的输入值赋值给inputList存储起来
    inputList[index-1].purchaseValue=e.detail.value
    //要计算出来的值
    console.log(inputList[index-1].sell)
    //计算出来的值=进价*数量
    inputList[index-1].sell=parseFloat(inputList[index-1].purchaseValue)*Number(inputList[index-1].value)
    //更新列表
    this.setData({
      inputList:inputList
    })
  },
  //输入商品名
  inpGoodname(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log(index)
    //获取输入的值
    console.log("输入的值："+e.detail.value)
    //将获取的输入值赋值给inputList存储起来
    inputList[index-1].goodName=e.detail.value
    //更新列表
    this.setData({
      inputList:inputList
    })
    console.log("商品名",inputList[index-1].goodName)
  },
  //输入规格
  inpSpecification(e){
    const {inputList} = this.data
    const {dataset: {index}} = e.currentTarget
    console.log(index)
    //获取输入的值
    console.log("输入的值："+e.detail.value)
    //将获取的输入值赋值给inputList存储起来
    inputList[index-1].specification=e.detail.value
    //更新列表
    this.setData({
      inputList:inputList
    })
    console.log("规格",inputList[index-1].specification)
  },
  //合计
  addSum(){
    //重置总数量和总金额，防止错误累加
    this.setData({
      sumNum:0,
      sumPrice:0,
    })
    const {inputList} = this.data
    // const {dataset: {index}} = e.currentTarget
    //遍历数量和金额，做累加运算
    for(var i =0;i<inputList.length;i++){
      this.data.sumPrice=parseFloat(inputList[i].sell)+parseFloat(this.data.sumPrice)
      this.data.sumNum=parseFloat(inputList[i].value)+parseFloat(this.data.sumNum)
    }
    var newsumPrice =parseFloat(this.data.sumPrice).toFixed(2)
    // console.log(this.data.sumNum)
    //更新到页面
    this.setData({
      sumPrice:newsumPrice,
      sumNum:this.data.sumNum
    })
  },
  //获取打印设置
  bossGetSet(){
    wx.cloud.callFunction({
      name:"bossGetSet"
    }).then(res=>{
      // console.log(res)
      this.setData({
        printTitle:res.result.data.printTitle,
        id:res.result.data._id
      })
      // console.log(this.data.printTitle)
    })
  },
  //重置表单
  replayPurchase(){
    const {inputList} = this.data
    Dialog.confirm({
      title: '提示',
      message: '是否重置进货单',
    })
      .then(() => {
        // on confirm
        if(this.data.inputList.length>=2){
          this.data.inputList.splice(1,this.data.inputList.length-1)
          this.data.inputList[0]={
            ghsValue:null,
            barCode:null,
            purchaseValue:null,
            value:1,
            goodName:null,
            sell:0
          }
          this.setData({
            inputList
          })
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  /**
   * 保存采购单
   */
  savePurchase(){
    wx.showLoading({
      title: '数据提交中',
      mask:true
    })
    const {inputList}=this.data
    wx.cloud.callFunction({
      name:"purchaseAddData",
      data:{
        inputList:inputList
      }
    }).then(res=>{
      this.purchaseGetCount()
      //通知栏显示成功消息
      console.log("保存采购单数据成功")
      console.log(res)
      setTimeout(function(){
        wx.hideLoading({
          complete: (res) => {},
        })
        Notify({ type: 'success',duration: 3000, message: '保存采购单成功'});
      },2000)
    })
  },
  /**
   * 获取采购单记录数
   */
  purchaseGetCount(){
    wx.cloud.callFunction({
      name:"purchaseGetCount"
    }).then(res=>{
      // console.log("获取采购单记录数",res.result.total)
      this.setData({
        purchaseDataCount:res.result.total
      })
      // console.log(res)
    })
  },


/*连接设置*/
  //过滤设备列表 
  getNewDevicesList(devices,name) {
      var that = this;    
      var newDevices = devices;
      var rssi = that.data.rssi;
      console.log('RSSI:', rssi);    
        
      //按RSSI过滤
      for (var i = 0; i < newDevices.length;) {        
        if (newDevices[i].RSSI < rssi)   newDevices.splice(i, 1);
        else i++;     
      }
      
      // 按名字过滤
      if(name!=''){
        for (var i = 0; i < newDevices.length;) {        
          if (newDevices[i].name.indexOf(name)==0)  i++;        
          else        newDevices.splice(i, 1);        
        }
      }
           
      /*
        const ids = [];
        //过滤
        const devs = devices
            .filter((item) => !(item.RSSI > 0 || item.name == '未知设备'))
            .map((item) => {
                ids.push(item.deviceId);
                return {
                    rssi: item.RSSI,
                    name: item.name,
                    devId: item.deviceId,
                };
            });
        //过滤重复
        const filterId = [...new Set(ids)];
        const newDevices = [];
        while (filterId.length) {
            const id = filterId.shift();
            for (let index = 0; index < devs.length; index++) {
                const item = devs[index];
                if (item.devId === id) {
                    newDevices.push(item);
                    break;
                }
            }
        }*/
        return newDevices;
  },
  //点击开始扫描蓝牙设备
  scanBluetooth(){
    scancount=0;
    zksdk.openBlue()
      .then((res) => {
        //打开遮罩层
        this.setData({
          show:true
        })
        //搜寻设备
        zksdk.startBluetoothDevicesDiscovery();
        //监听寻找新设备
        zksdk.onfindBlueDevices(this.onGetDevice)})
      .catch((res) => {
        console.log(res)
        console.log('catch res:'+res);
        const coode = res.errCode ? res.errCode.toString() : '';
        const msg = errMsg[coode];
        wx.showToast({
          title: msg || coode,
          icon: 'none',
        });
      });
  },
  //获取设备列表
  onGetDevice:function(res){
    var that = this;    
    scancount++;
    if(scancount<=1){
      console.log('onGetDevice', res); 
      console.log('onGetDevice', that.data.BTName); 
      this.setData({
      mydeviceList: this.getNewDevicesList(res, that.data.BTName)
      });
      console.log(this.data.mydeviceList)
      // console.log('stopPullDownRefresh');
      // wx.stopPullDownRefresh();   
    }       
  },
  //点击设备事件处理
  chooseDevice: function(e) {
    console.log(e.currentTarget.dataset.title);
    console.log(e.currentTarget.dataset.name);
    var deviceid =  e.currentTarget.dataset.title;
    var devicename = e.currentTarget.dataset.name;
    wx.setStorageSync('deviceid', deviceid);
    wx.setStorageSync('devicename', devicename);
    //关闭遮罩层
    this.setData({
      deviceId:deviceid,
      deviceName:devicename,
      show:false
    })
    console.log('---bindViewTap---点击连接蓝牙--success--')
    // wx.navigateTo({      
    //   url: '../bluetooththrsec/bluetooththrsec?deviceId='+deviceId+'&name='+name,
    //   success: function(res){
    //        console.log('---bindViewTap---点击连接蓝牙--success--',res)
    //   },
    //   fail: function(res) {
    //        console.log('---bindViewTap---点击连接蓝牙--fail--',res)
    //   }
    // })
  },
  /*关闭搜索结果遮罩弹窗*/
  onClose() {
    this.setData({ show: false });
  },

/**
 * 打印
 */
  //提交表单
  //在扫描完成后，就将sub的监听设备连接状态直接弄过去，弹出框也弄直接打印的地方，但是连接就是连接
  buletoothConnect(){
    wx.showLoading({
      title: '正在连接',
      mask:true
    })
    console.log(this.data.inputList)
    var that = this;        
    //var serv_id = '0000FFF0-0000-1000-8000-00805F9B34FB'
    // console.log("onLoad");
    // console.log('deviceId=' + opt.deviceId);
    // console.log('name=' + opt.name);
    that.setData({btn_disabled:true});
    console.log('Disable button');
    // that.setData({deviceId: opt.deviceId,name: opt.name});
    // 监听设备的连接状态
    wx.onBLEConnectionStateChange(function (res) {
       console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })

    zksdk.createBLEConnection(that.data.deviceId, this.onConnectSuccess, this.onConnectFail);

    // Dialog.confirm({
    //   title: '通知',
    //   message: '现在是否打印',
    // })
    //   .then(() => {
    //     // on confirm
    //     this.bindViewTap1()
    //   })
    //   .catch(() => {
    //     // on cancel
    //   });
    setTimeout(function(){
      wx.hideLoading({
        complete: (res) => {},
      })
    },500)
  },
  /*打印设置*/
    //---连接成功----
    onConnectSuccess(res){   
      var that = this;   
      console.log('onConnectSuccess', res); 
      zksdk.getBLEDeviceServices(that.data.deviceId, this.onGetServicesSuccess, this.onGetServicesFail);     
      this.setData({
        buletoothConnect:true
      }) 
    },
    //---连接失败----
    onConnectFail(res){    
      console.log('onConnectFail', res);      
      this.setData({
        buletoothConnect:false
      })  
    },
    //---Services获取成功----
    onGetServicesSuccess(res){    
      var that = this;  
      console.log('onGetServicesSuccess', res); 
      this.setData({ services: res.serviceId });    
      zksdk.getDeviceCharacteristics(that.data.deviceId, that.data.services, this.onGetCharacterSuccess, this.onGetCharacterFail);
    },
    //---Services获取失败----
    onGetServicesFail(res){    
      console.log('onGetServicesFail', res);        
    },
    //---Characteristics获取成功----
    onGetCharacterSuccess(res){
        console.log('onGetCharacterSuccess servid ', res.serviceId);      
        console.log('write character ',res.writeId);
        console.log('read character ',res.readId);
        this.setData({ 
            serviceId: res.serviceId,  
            writeId: res.writeId, 
            readId: res.readId,
        });          
        this.setData({btn_disabled:false});
        console.log('Enable button');
        //---停止扫描蓝牙设备---------
        zksdk.stopBlueDevicesDiscovery();
    },
    //---Characteristics获取失败----
    onGetCharacterFail(res){
      console.log('onGetCharacterFail', res);
    },
    //------Characteristic信息变化回调-------
    onGetBLEValueChange:function(res){
      var that = this;
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
      console.log(util.ab2hex(res.value))
      //if (res.characteristicId == `0000FFF1-0000-1000-8000-00805F9B34FB`)
      {                                            
          var view1 = new DataView(res.value);
          //console.log(res.value.byteLength);
          //console.log(view1.getUint8(0));
          //console.log(view1.getUint8(2));
          if (res.value.byteLength >= 4 && view1.getUint8(0) == 0x1d && view1.getUint8(1)==0x99){
            let strSta=" ";
            if (view1.getUint8(2) == 0) strSta = "正常";                                       
            if (view1.getUint8(2) & 0x01) strSta=strSta+ ' 缺纸';
            if (view1.getUint8(2) & 0x02)  strSta=strSta + ' 开盖' ;                                             
            if (view1.getUint8(2) & 0x04) strSta=strSta + ' 打印头过热';                                              
            if (view1.getUint8(2) & 0x08) strSta=strSta + ' 定位失败';                                            
            if (view1.getUint8(2) & 0x10) strSta=strSta +' 低电';  
            if (view1.getUint8(2) & 0x20) strSta=strSta + ' 正在打印';
            that.setData({ State: strSta }) 
          }
          if(res.value.byteLength >= 9 && view1.getUint8(0) == 0x20 && view1.getUint8(1)==0x06){
              
              let buffer = new ArrayBuffer(6)
              let dataView = new DataView(buffer)
              for(var i=0;i<6;i++) dataView.setUint8(i, view1.getUint8(3+i)); 

              let dev_mac=buffer.join(":");
              that.setData({ Dev_mac: dev_mac });   
              console.log('mac:'+dev_mac);

          }
      }
    },
    //------打印机状态获取----------
    btn_GetState:function(){
      console.log('GetState')
      var that = this;
      const opt = { 
          deviceId: this.data.deviceId, 
          serviceId: this.data.serviceId, 
          characteristicId: this.data.readId,         
      };

      //-----打开状态通知功能------
      zksdk.onGetBLECharacteristicValueChange(opt,this.onGetBLEValueChange);
      let buffer = new ArrayBuffer(2)
      let dataView = new DataView(buffer)
      dataView.setUint8(0, 0x1D)
      dataView.setUint8(1, 0x99)
      let len=20;
      const optWt = { 
          deviceId: this.data.deviceId, 
          serviceId: this.data.serviceId, 
          characteristicId: this.data.writeId,
          value:buffer,
          lasterSuccess: this.onSendSuccess,
          onceLength:len
      };
      //const opt = { deviceId: this.data.deviceId, ...this.character };
      zksdk.sendDataToDevice(optWt);
    },
    //---数据全部发送成功回调----
    onSendSuccess:function(){
      console.log("onSendSuccess");
    },
  /**
    * 打印指令测试
    */
    bindViewTap1: function () {
      this.addSum()
      wx.showLoading({
        title: '打印中',
        mask:true
      })
      var that = this;
      //let buffer = wx.base64ToArrayBuffer("");
      var allheight =this.data.inputList.length*80+240+120+40+80
      let strCmd =zksdk.CreatCPCLPage(560,allheight,1,0);
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,0,'56','5',0,this.data.printTitle);
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,45,'3','0',0,'专注数据分析 老板必备助手');
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,80,'3','0',0,'------------------------------------------------');
      strCmd += zksdk.addCPCLLocation(0);
      strCmd += zksdk.addCPCLText(0,120,'3','0',0,'序号');
      strCmd += zksdk.addCPCLText(60,120,'3','0',0,'条形码');
      strCmd += zksdk.addCPCLText(265,120,'3','0',0,'供货商');
      strCmd += zksdk.addCPCLText(455,120,'3','0',0,'规格');
      strCmd += zksdk.addCPCLText(60,160,'3','0',0,'品名');
      strCmd += zksdk.addCPCLText(280,160,'3','0',0,'数量');
      strCmd += zksdk.addCPCLText(360,160,'3','0',0,'进价');
      strCmd += zksdk.addCPCLText(455,160,'3','0',0,'小计');
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,200,'3','0',0,'------------------------------------------------');
      strCmd += zksdk.addCPCLLocation(0);
      var optheight = 240
      for(var i = 0 ; i<this.data.inputList.length;i++){
        strCmd += zksdk.addCPCLText(0,optheight,'3','0',0,i+1);
        strCmd += zksdk.addCPCLText(40,optheight,'3','0',0,this.data.inputList[i].barCode);
        strCmd += zksdk.addCPCLText(250,optheight,'3','0',0,this.data.inputList[i].ghsValue);
        strCmd += zksdk.addCPCLText(455,optheight,'3','0',0,this.data.inputList[i].specification);
        optheight = optheight+40
        strCmd += zksdk.addCPCLText(40,optheight,'3','0',0,this.data.inputList[i].goodName);
        strCmd += zksdk.addCPCLText(300,optheight,'3','0',0,this.data.inputList[i].value);
        strCmd += zksdk.addCPCLText(360,optheight,'3','0',0,this.data.inputList[i].purchaseValue);
        strCmd += zksdk.addCPCLText(455,optheight,'3','0',0,this.data.inputList[i].sell);
        optheight = optheight+40
      }
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,optheight,'3','0',0,'------------------------------------------------');
      strCmd += zksdk.addCPCLLocation(0);
      strCmd += zksdk.addCPCLText(0,optheight+40,'3','0',0,'合计');
      var dySumNum =String(this.data.sumNum) + '件'
      var dySumPrice =String(this.data.sumPrice) + '元'
      strCmd += zksdk.addCPCLText(360,optheight+40,'3','0',0,dySumNum);
      strCmd += zksdk.addCPCLText(455,optheight+40,'3','0',0,dySumPrice);
      strCmd += zksdk.addCPCLLocation(2);
      strCmd += zksdk.addCPCLText(0,optheight+40+40,'3','0',0,'------------------------------------------------');
      strCmd += zksdk.addCPCLLocation(0);
      strCmd += zksdk.addCPCLText(0,optheight+40+40+40,'3','0',0,'超市助手官方热线 15272508416 徐经理');



      // strCmd += zksdk.addCPCLBarCode(,0,'128',80,0,1,1,this.data.inputList[0].barCode);
      // strCmd += zksdk.addCPCLText(290,80,'7','2',0,this.data.inputList[0].barCode);
      // strCmd += zksdk.addCPCLSETMAG(2,2);
      // strCmd += zksdk.addCPCLSETMAG(0,0);
      // strCmd += zksdk.addCPCLText(350,180,'7','2',0,this.data.inputList[0].sell);
      // strCmd += zksdk.addCPCLLocation(2);
      // strCmd += zksdk.addCPCLQRCode(0,220,'M', 2, 6, 'qr code test');

      strCmd += zksdk.addCPCLPrint();
      console.log(strCmd);
      
      let buffer = util.hexStringToBuff(strCmd);
      var datalen=20;
      if (app.globalData.platform == 'ios')
      {
        console.log('platform:', app.globalData.platform)   
        datalen=180;
      }
      const opt = { 
        deviceId: this.data.deviceId, 
        serviceId: this.data.serviceId, 
        characteristicId: this.data.writeId,
        value:buffer,
        lasterSuccess: this.onSendSuccess,
        onceLength:datalen
      };
      //const opt = { deviceId: this.data.deviceId, ...this.character };
      zksdk.sendDataToDevice(opt);
      wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bossGetSet()
    this.purchaseGetCount()
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
    this.bossGetSet()
    this.purchaseGetCount()
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    // console.log("上一页面传递过来的值")
    // console.log(currPage.__data__.inputList);//此处既是上一页面传递过来的值
    this.setData({
      inputList:currPage.__data__.inputList
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
    // ----关闭扫描蓝牙设备----
    zksdk.closeBLEConnection(this.data.deviceId);
    zksdk.stopBlueDevicesDiscovery();
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