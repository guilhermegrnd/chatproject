'use strict';
class Chat {

  async insertMessage(app,json) {
    try {
      // if(!isObject(json)){
      //   console.log("Json is not an object")
      //   return
      // }
      let status = 'error';
      let retMsg = '';
      let data = {};
      return await new Promise(
        function(resolve, reject) {
          let db = new app.models.db.mongoDbClient()
          let cn = db.connect({url:'mongodb://localhost:27017',dbName:'chatproject'}, ()=>{}, ()=>{});
          cn.then((result)=>{

            let jsonData = {
              fromId : json.fromId,
              fromName : json.fromName,
              toId : json.toId,
              message : json.message,
              chatId : json.chatId,
              time : json.time
            }
            let insert = db.insertDocumentWithIndex('chat', jsonData)
            insert.then((result)=>{
              console.log(result)
              status = 'success'
              retMsg = 'Message saved'
              let json = {status:status,message:retMsg}
              resolve(json)
            }).catch(err => {
              console.error(err)
              let json = {status:status,message:'Insert error '+err.message}
              resolve(json)
            })
          }).catch(err => {
            console.error(err)
            let json = {status:status,message:'Connect error '+err.message}
            resolve(json)
          })
        }
      );
    }
    catch(e) {
      console.log("insertMessage: Error caught, "+e.message)
      return
    }
  }

  async findMessages(app,json) {
    try {
      // if(!isObject(json)){
      //   console.log("mongoClient.insertDocumentWithIndex: document is not an object")
      //   return
      // }
      let status = 'error';
      let retMsg = '';
      let data = {};
      return await new Promise(
        function(resolve, reject) {
          let db = new app.models.db.mongoDbClient()
          let cn = db.connect({url:'mongodb://localhost:27017',dbName:'chatproject'}, ()=>{}, ()=>{});
          cn.then((result)=>{
            let fromId = json.fromId
            let toId = json.toId
            let find = db.findDocFieldsByFilter('chat',{$or:[{fromId:fromId,toId:toId},{fromId:toId,toId:fromId}]},{},0,0,{id:-1})
            find.then((result)=>{
              if (result.length > 0) {
                status = 'success'
                retMsg = 'Data retrieved'
                data = result
              } else {
                status = 'error'
                retMsg = 'No data'
              }
              let json = {status:status,message:retMsg,data:data}
              resolve(json)
            }).catch(err => {
              console.error(err)
              let json = {status:status,message:'Find error '+err.message}
              resolve(json)
            })
          }).catch(err => {
            console.error(err)
            let json = {status:status,message:'Connect error '+err.message}
            resolve(json)
          })
        }
      );
    }
    catch(e) {
      console.log("insertMessage: Error caught, "+e.message)
      return
    }
  }

}

module.exports = Chat