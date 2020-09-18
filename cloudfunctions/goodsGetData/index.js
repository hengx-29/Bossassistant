// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var barcode = event.barcode
  var num =event.num;
  var page=event.page;
  if(barcode){
    if(num){
      return await db.collection("boss-good-list").where({
        barcode:barcode
      }).skip(page).limit(num).get()
    }else{
      return await db.collection("boss-good-list").where({
        barcode:barcode
      }).get()
    }
  }else{
    //等待完成后“获取”商品表中的数据
    return await db.collection("boss-good-list").skip(page).limit(num).get()
  }
}