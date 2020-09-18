// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    var inputList=event.inputList
    var time=new Date().getTime()
    return await db.collection("boss-purchasedata").add({
      data:{
        inputList,
        time,
      }
    })
  }catch(e){
    console.error(e)
  }
}