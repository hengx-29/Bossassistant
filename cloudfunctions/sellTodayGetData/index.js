// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const _ = db.command
// const $ = db.command.aggregate
//to_days(time) = to_days(now())
var today = new Date().toLocaleDateString()
// console.log(time)
//优化
//获取当前时间日期的时间戳
// var time=(new Date).getTime();
//转换格式为2020-08-03T18:31:53.670Z
// var today=new Date(time);
// 云函数入口函数
exports.main = async (event, context) => {
  // return today
  return await db.collection("boss-selldata")
  .where({
    date:_.and(_.gte(new Date(today+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
  })
  .get()
}