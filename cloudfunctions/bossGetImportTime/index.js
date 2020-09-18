// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const _ = db.command 
// 云函数入口函数
  exports.main = async (event, context) => {
    return await db.collection("boss-selldata")
    .aggregate()
    .sort({
      date: -1
    })
    .end()
}