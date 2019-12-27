'use strict';
class Secure {
  // put more app route listings here
  constructor() {
  }

  setId(id) {
    this._id = id;
  }
  getId() {
    return this._id;
  }

  setName(name) {
    this._name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  getName() {
    return this._name;
  }

  getAll() {
    return {id:this.getId(),name:this.getName()};
  }

  loginAuth(json) {
    let user = json['login-user']
    let pass = json['login-pass']
    if(user == '' || pass == '') {
      return {
        status:'error',
        message:'Make sure you have filled all the fields'
      }
    }
    let db = require('../db/users.json')
    const authenticate = db.map((element)=>{return element}).filter((element)=> element.user == user && element.pass == pass)
    if (authenticate.length == 1) {
      this.setId(authenticate[0].id)
      this.setName(authenticate[0].user)
      /*let jwt = require('jsonwebtoken');
      let config = require('./config');
      let middleware = require('./middleware');
      let token = jwt.sign({id: authenticate[0].id,name:authenticate[0].user},
        config.secret,
        { expiresIn: '24h' // expires in 24 hours
        }
      );*/
      return {
        status:'success',
        message:'Loged in successfully'
      }
    } else {
      return {
        status:'error',
        message:'Credentials not found'
      }
    }
  }

  async accountNew(json) {
    let user = json['account-user']
    let pass = json['account-pass']
    let pass2 = json['account-pass2']
    if(user == '' || pass == '' || pass2 == '') {
      return {
        status:'error',
        message:'Make sure you have filled all the fields'
      }
    }
    if(pass != pass2) {
      return {
        status:'error',
        message:'Passwords do not match'
      }
    }
    let fs = require('fs')
    let status = 'error';
    let retMsg = '';
    return await new Promise(
      function(resolve, reject) {
        fs.readFile('./db/users.json', 'utf8', function readFileCallback(err, data){
          if (err){
            retMsg = err
          } else {
            let obj = JSON.parse(data)
            const authenticate = obj.map((element)=>{return element}).filter((element)=> element.user == user)
            if (authenticate.length == 0) {
              let id = obj.length+1
              obj.push({id:id,user:user,pass:pass})
              json = JSON.stringify(obj)
              fs.writeFile('./db/users.json', json, 'utf8', (err) =>{
                if(err){
                  retMsg = err
                }
              });
              status = 'success'
              retMsg = 'Account created successfully'
            } else {
              status = 'error'
              retMsg = 'There is an account with this username already'
            }
          }
          let json = {status:status,message:retMsg}
          resolve(json)
        });
      }
    );
  }

  async loginAuth2(app,json) {
    let user = json['login-user']
    let pass = json['login-pass']
    if(user == '' || pass == '') {
      return await {
        status:'error',
        message:'Make sure you have filled all the fields'
      }
    }
    let status = 'error';
    let retMsg = '';
    let data = {};
    return await new Promise(
      function(resolve, reject) {
        let db = new app.models.db.mongoDbClient()
        let cn = db.connect({url:'mongodb://localhost:27017',dbName:'chatproject'}, ()=>{}, ()=>{});
        cn.then((result)=>{
          let find = db.findDocFieldsByFilter('users',{name:user,pass:pass},{},0,0,'')
          find.then((result)=>{
            if (result.length == 1) {
              status = 'success'
              retMsg = 'Logged in successfully'
              data = result[0]
            } else {
              status = 'error'
              retMsg = 'Credentials not found'
            }
            let json = {status:status,message:retMsg,data:data}
            resolve(json)
          })
        })
      }
    );
  }

  async accountNew2(app,json) {
    let user = json['account-user']
    let pass = json['account-pass']
    let pass2 = json['account-pass2']
    if(user == '' || pass == '' || pass2 == '') {
      return {
        status:'error',
        message:'Make sure you have filled all the fields'
      }
    }
    if(pass != pass2) {
      return {
        status:'error',
        message:'Passwords do not match'
      }
    }
    let status = 'error';
    let retMsg = '';
    let data = {};
    return await new Promise(
      function(resolve, reject) {
        let db = new app.models.db.mongoDbClient()
        let cn = db.connect({url:'mongodb://localhost:27017',dbName:'chatproject'}, ()=>{}, ()=>{});
        cn.then((result)=>{
          let find = db.findDocFieldsByFilter('users',{name:user,pass:pass},{},0,0,'')
          find.then((result)=>{
            console.log(result)
            if (result.length == 0) {
              let insert = db.insertDocumentWithIndex('users', {name:user,pass:pass})
              insert.then((result)=>{
                console.log(result)
                status = 'success'
                retMsg = 'Account created successfully'
                let json = {status:status,message:retMsg}
                resolve(json)
              }).catch(err => {
                console.error(err)
                let json = {status:status,message:'Insert error '+err.message}
                resolve(json)
              })
            } else {
              console.log(result)
              let json = {status:status,message:'There is an account with this username already'}
              resolve(json)
            }
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

}

module.exports = Secure