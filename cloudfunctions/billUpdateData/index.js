// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var id=event.id
  var status=event.status
  if(event.supplier){
    var supplier=event.supplier
    var selfcode=event.selfcode
    var time=event.time
    var price=event.price
    var salesman=event.salesman
    var phone=event.phone
    try{
      return await db.collection("boss-billdata").doc(id).update({
        data:{
          supplier:supplier,
          selfcode,
          status,
          time,
          price,
          salesman,
          phone
        }
      })
    }catch(e){
      console.error(e)
    }
  }else{
    return await db.collection("boss-billdata").doc(id).update({
      data:{
        status
      }
    })
  }

}