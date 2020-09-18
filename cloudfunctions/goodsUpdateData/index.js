// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var id=event.id
  var barcode=event.barcode
  var name=event.name
  var supplier=event.supplier
  var category=event.category
  var specification=event.specification
  var purchaseprice=event.purchaseprice
  var sellingprice=event.sellingprice
  var selfcode=event.selfcode
  try{
    return await db.collection("boss-good-list").doc(id).update({
      data:{
        barcode:barcode,
        name:name,
        supplier,
        category,
        specification,
        purchaseprice,
        sellingprice,
        selfcode
      }
    })
  }catch(e){
    console.error(e)
  }
}