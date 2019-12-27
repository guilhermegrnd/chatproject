'use strict';
let mongoClient = require("mongodb").MongoClient,
ObjectId = require("mongodb").ObjectId,
db

function isObject(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object
}

class mongoDbClient {
  async connect(conn, onSuccess, onFailure){
    try {
      let connection = await mongoClient.connect(conn.url, { useNewUrlParser: true, useUnifiedTopology: true })
      this.db = connection.db(conn.dbName)
      console.log("MongoClient Connection successfull.")
      onSuccess()
    }
    catch(ex) {
      console.log("Error caught,", ex)
      onFailure(ex)
    }
  }

  async getNextSequence(coll) {
    return await this.db.collection("counters").findOneAndUpdate({
        id: coll
      },
      {$inc: {seq: 1}},
      {projections: {seq: 1},
        upsert: true,
        returnOriginal: false
      }
    )
  }

  async insertDocumentWithIndex(coll, doc) {
    try {
      if(!isObject(doc)){
        console.log("mongoClient.insertDocumentWithIndex: document is not an object")
        return
      }
      let index = await this.getNextSequence(coll)
      doc.id = index.value.seq
      return await this.db.collection(coll).insertOne(doc)
    }
    catch(e) {
      console.log("mongoClient.insertDocumentWithIndex: Error caught, "+e.message)
      return
    }
  }

  async insertDocument(coll, doc, cb) {
    try {
      if(!isObject(doc)){
        console.log("mongoClient.insertDocument: document is not an object")
        return
      }

      return await this.db.collection(coll).insertOne(doc)
    }
    catch(e) {
      console.log("MongoClient.InsertDocument: Error caught, "+e.message)
      return
    }
  }

  async findDocFieldsByFilter(coll, query, projection, lmt, skip, sort) {
    if(!query){
      console.log("mongoClient.findDocFieldsByFilter: query is not an object")
    }
    return await this.db.collection(coll).find(query, {
      projection: projection || {},
      limit: lmt || 0,
      skip: skip || 0,
      sort: sort
    }).toArray()
  }

  async findDocByAggregation(coll, query) {
    if(!query.length){
      console.log("mongoClient.findDocByAggregation: query is not an object")
    }
    return this.db.collection(coll).aggregate(query).toArray()
  }

  async getDocumentCountByQuery(coll, query) {
    return this.db.collection(coll).estimatedDocumentCount(query || {})
  }

  async findOneAndUpdate(coll, query, values, option) {
    if(!(isObject(values) && isObject(query))){
      console.log("mongoClient.UpdateDocument: values and query should be an object")
    }
    return this.db.collection(coll).findOneAndUpdate(query, {$set : values}, option || {})
  }

  async modifyOneDocument(coll, query, values, option) {
    if(!(isObject(values) && isObject(query))){
      console.log("mongoClient.ModifyOneDocument: values, query and option should be an object")
    }
    return await this.db.collection(coll).updateOne(query, values, option || {})
  }
}

module.exports = {
  mongoDbClient,
  ObjectId
}