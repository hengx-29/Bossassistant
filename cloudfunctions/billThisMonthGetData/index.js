// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const _ =db.command
// 云函数入口函数
//to_days(time) = to_days(now())
var time=new Date;
var thisMonth=time.getFullYear() +"-"+ (time.getMonth() + 1);
var startThisMonth = new Date(thisMonth+"-01 00:00:00").getTime()
var endThisMonth = new Date(thisMonth+"-31 23:59:59").getTime()
// console.log(time)
exports.main = async (event, context) => {
  var status=event.status
  if(status=="0"){
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(startThisMonth.toString()),_.lte(endThisMonth.toString())),
      status:"0"
    })
    .get()
  }else if(status=="1"){
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(startThisMonth.toString()),_.lte(endThisMonth.toString())),
      status:"1"
    })
    .get()
  }else{
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(startThisMonth.toString()),_.lte(endThisMonth.toString()))
    })
    .get()
  }
}