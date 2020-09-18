/**
 * 模糊搜索
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db = cloud.database({
  env: 'mycloud-mecqe'
})
//数据库操作符，通过 db.command 获取
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var search = event.search
    return await db.collection("boss-good-list").where(_.or([{
      barcode: {
        $regex: '.*' + search + '.*',
        $options: '1'
      }
    }, {
      name: {
        $regex: '.*' + search + '.*',
        $options: '1'
      }
    }, {
      supplier: {
        $regex: '.*' + search + '.*',
        $options: '1'
      }
    }, {
      category: {
        $regex: '.*' + search + '.*',
        $options: '1'
      }
    }, {
      specification: {
        $regex: '.*' + search + '.*',
        $options: '1'
      }
    }, {
      selfcode: search
    }])).get()
  } catch (e) {
    console.error(e)
  }

}