// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('boss-good-list')
    .aggregate()
    .group({
      _id: null,//不指定id字段是为了下面分组查找
      categories: $.addToSet('$category')//categories是设置的字段，addToSet是添加字段，$name是获取数据库中的name字段数据
    })
    .end()
}