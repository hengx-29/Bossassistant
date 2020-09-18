// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化
cloud.init()
//连接云数据库
const db =cloud.database()
const $ = db.command.aggregate
const _ = db.command 
process.env.Tz ='Asia/Shanghai'
var today = new Date().toLocaleDateString()
var monthtime=(new Date).getTime()-24*60*60*1000*19;
var monthTime=new Date(monthtime).toLocaleDateString();
// 云函数入口函数
  exports.main = async (event, context) => {
  //   let count =await getCount();
  //   count = count.total;
  //   let list = []
  //   for (let i = 0; i < count; i += 100) {//自己设置每次获取数据的量
  //     list = list.concat(await getList(i));
  //   }
  //   return list;
  // }
  // async function getCount() {//获取数据的总数，这里记得设置集合的权限
  //   let count = await db.collection('boss-selldata').where({
  //   }).count();
  //   return count;
  // }
  // async function getList(skip) {//分段获取数据
  //   let list = await db.collection("boss-selldata").aggregate()
  // .match({
  //   date:_.and(_.gte(new Date(monthTime+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
  // })
  // .addFields({
  //   tempDate:$.dateToString({
  //     date: '$date',
  //     format:'%m-%d',
  //     timezone: 'Asia/Shanghai',
  //     onNull: 'null'
  //   }),
  // })
  // .group({
  //   _id: '$tempDate',
  //   price: $.sum('$price')
  // })
  // .sort({
  //   _id: 1
  // })
  // .skip(skip)
  // .end();
  //   return list.data;
  // }

return await db.collection("boss-selldata").aggregate()
.match({
  date:_.and(_.gte(new Date(monthTime+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
})
.addFields({
  tempDate:$.dateToString({
    date: '$date',
    format:'%m-%d',
    timezone: 'Asia/Shanghai',
    onNull: 'null'
  }),
})
.group({
  _id: '$tempDate',
  price: $.sum('$price')
})
.sort({
  _id: 1
})
// .skip(skip)
.end()
}