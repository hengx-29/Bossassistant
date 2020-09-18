// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const $ = db.command.aggregate
const _ = db.command 
var today = new Date().toLocaleDateString()
// 云函数入口函数
  exports.main = async (event, context) => {
    return await db.collection("boss-selldata").aggregate()
  .match({//筛选今天
    date:_.and(_.gte(new Date(today+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
  })
  .group({//取今天的类别
    _id: null,
    categories: $.addToSet('$name')
  })
  .end()
}