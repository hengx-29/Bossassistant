// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const $ = db.command.aggregate
const _ = db.command 
process.env.Tz ='Asia/Shanghai'
var today = new Date().toLocaleDateString()
var seventime=(new Date).getTime()-24*60*60*1000*6;
var sevenTime=new Date(seventime).toLocaleDateString();
// 云函数入口函数
  exports.main = async (event, context) => {
    return await db.collection("boss-selldata").aggregate()
  // .where({
  //   date:_.and(_.gte(new Date(sevenTime+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
  //   // date:_.eq(new Date(date))
  // })
  // .get()
  .match({
    date:_.and(_.gte(new Date(sevenTime+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
  })
  .addFields({
    tempDate:$.dateToString({
      date: '$date',
      format:'%m-%d',
      // format:'%Y-%m-%d',
      timezone: 'Asia/Shanghai',
      onNull: 'null'
    }),
  })
  .group({
    _id: '$tempDate',
    price: $.sum('$price')
  })
  .sort({
    _id: 1
})
  .end()
}
// .addFields({
//   // tempDateTime: $.add('$tempDate')
//   tempDateTime: '$tempDate'
// })