// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const _ = db.command
// 云函数入口函数
//to_days(time) = to_days(now())
var time=(new Date).getTime()-24*60*60*1000;
// var date = (new Date).getDate(time);
// var newdate= new Date("2020-08-02 23:01:54")
var yesterday=new Date(time).toLocaleDateString();
// var month=yesterday.getMonth();
// var day=yesterday.getDate();
// yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
// yesterday=yesterday.getFullYear() +"-"+ (yesterday.getMonth() + 1) +"-"+ yesterday.getDate();
// console.log(time)
// exports.main = async (event, context) => {
//   return await db.collection("boss-selldata")
//   .where({
//     time:{
//       $regex: '.*' + yesterday + '.*',
//       $options: '1'
//     }
//   })
//   .get()
// }
// var date = new Date("2020-08-04 00:37:00");
// date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
// var pattern = /[1-9]\d*/
// var date = pattern+pattern+":"+pattern+pattern+":"+pattern+pattern
exports.main = async (event, context) => {
  // return yesterday
  return await db.collection("boss-selldata")
  .where({
    date:_.and(_.gte(new Date(yesterday+" 00:00:00")),_.lte(new Date(yesterday+" 23:59:59")))
    // date:_.eq(new Date(date))
  })
  .get()
}