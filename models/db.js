'use strict';
class Db {

  client = '';

  constructor() {
  }

  connectDbOpen() {
    const mongo = require('mongodb').MongoClient
    const url = 'mongodb://localhost:27017'
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      //...
      this.client = client
    })
  }

  connectDbClose() {
    client.close()
  }

  insertUser(name,pass) {
    let client = this.client
    const db = client.db('chatproject')
    const collection = db.collection('users')
    collection.find({name: name}).toArray((err, items) => {
      console.log(items)
      if(items.length == 0) {
        collection.insertOne({name:name,pass:pass}, (err, result) => {
        if (err) {
          return {
            status:'error',
            message:err
          }
        }
        return {
          status:'success',
          message:result
        }
      })
      } else {
        return {
          status:'error',
          message:'User already registered'
        }
      }
    })
  }

  findUser(name) {
    let client = this.client
    const db = client.db('chatproject')
    const collection = db.collection('users')
    collection.find({name: name}).toArray((err, items) => {
      console.log(items)
      if(items.length == 1) {
        collection.insertOne({name:name,pass:pass}, (err, result) => {
        if (err) {
          return {
            status:'error',
            message:err
          }
        }
        return {
          status:'success',
          message:result,
          data:items
        }
      })
      } else {
        return {
          status:'error',
          message:'Failed to find'
        }
      }
    })
  }

}

module.exports = Db