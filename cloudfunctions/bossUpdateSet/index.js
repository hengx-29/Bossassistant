// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var id=event.id
  var TargetTurnover=event.TargetTurnover
  var printTitle=event.printTitle
  try{
    if(TargetTurnover){
      return await db.collection("boss-set").doc(id).update({
        data:{
          TargetTurnover:TargetTurnover,
        }
      })
    }else if(printTitle){
      return await db.collection("boss-set").doc(id).update({
        data:{
          printTitle:printTitle,
        }
      })
    }
  }catch(e){
    console.error(e)
  }
}