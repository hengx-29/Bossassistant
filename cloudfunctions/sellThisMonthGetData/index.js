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
// console.log(time)
exports.main = async (event, context) => {
  return await db.collection("boss-selldata")
  .where({
    // time:{
    //   $regex: '.*' + thisMonth + '.*',
    //   $options: '1'
    // }
    date:_.and(_.gte(new Date(thisMonth+"-01 00:00:00")),_.lte(new Date(thisMonth+"-31 23:59:59")))
  })
  .get()
}