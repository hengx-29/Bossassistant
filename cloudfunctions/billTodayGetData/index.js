// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const _ = db.command
//to_days(time) = to_days(now())
var today = new Date().toLocaleDateString()
var starttoday = new Date(today+" 00:00:00").getTime()
var endtoday = new Date(today+" 23:59:59").getTime()

// 云函数入口函数
exports.main = async (event, context) => {
  // return starttoday
  var status=event.status
  if(status=="0"){
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(starttoday.toString()),_.lte(endtoday.toString())),
      status:"0"
    })
    .get()
  }else if(status=="1"){
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(starttoday.toString()),_.lte(endtoday.toString())),
      status:"1"
    })
    .get()
  }else{
    return await db.collection("boss-billdata")
    .where({
      time:_.and(_.gte(starttoday.toString()),_.lte(endtoday.toString())),
    })
    .get()
  }
}