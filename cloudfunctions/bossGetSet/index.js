// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('boss-set')
  .doc('9ffb2a485f35576d00808a3665aab9fe')
  .get();
}