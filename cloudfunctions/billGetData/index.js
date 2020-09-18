// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    var status=event.status
    if(status=="0"){
      return await db.collection("boss-billdata")
      .where({
        status:"0"
      })
      .get()
    }else if(status=="1"){
      return await db.collection("boss-billdata")
      .where({
        status:"1"
      })
      .get()
    }else{
      return await db.collection("boss-billdata").get()
    }
}