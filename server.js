//npm install --save express      -- INSTALL EXPRESS ON PROJECT
//npm install ejs --save          -- INSTALL EJS TEMPLATE
//npm install body-parser --save  -- INTALL PARSER BODY
//npm install request --save      -- INSTALL REQUEST MODULE
//npm install nodemon --save-dev  -- INSTALL NODEMON AUTOREFRESH NODE
//npm install mongodb             -- INSTALL MONGODB

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

const controllers = require('./controllers')
controllers.set(app)

const models = require('./models')
app.models = models

let server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// let mongoClient = require("mongodb").MongoClient
// let connection = mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
// connection.then((result)=>{
//   let db = result.db('chatproject')
//   // db.dropDatabase();
//   // db.collection('chat').deleteOne({fromName:'root'});a
//   let find = db.collection('chat').find().toArray();
//   find.then((result)=>{
//     console.log(result)
//   })
// })

//SOCKET IO
const io = require('socket.io')(server)
let connectedUsers = [];
io.on('connection', function(socket){
	//console.log(socket.handshake)
	let userData = socket.handshake.query;
	let userFound = null
	for(let i = 0; i < connectedUsers.length; i++) {
		if(connectedUsers[i].userId == userData.id) {
			userFound = i;
		}
	}
	if(userFound != null)
	{
		connectedUsers[userFound].status = 'online'
		connectedUsers[userFound].socketId = socket.id
	}
	else
	{
		connectedUsers.push({ socketId:socket.id, status:'online', userName: userData.name, userId: userData.id })
	}
  app.usersConnected = connectedUsers
  // console.log(userData.name+" connected")

  io.emit('userlogged', { socketId:socket.id, status:'online', userName: userData.name, userId: userData.id });

  socket.on('disconnect', function () {

    let user = connectedUsers.map((element)=>{return element}).filter((element)=> element.userId == userData.id)
    user = user[0];
    // console.log(user.userName+" disconnected")
    for(let i = 0; i < connectedUsers.length; i++) {
			if(connectedUsers[i].userId == user.userId) {
				connectedUsers[i].status = 'offline'
			}
		}

  });

  socket.on('chatmessage', (data)=>{

    let user = connectedUsers.map((element)=>{return element}).filter((element)=> element.userId == userData.id)
    user = user[0];

    let jsonData = {
    	fromId : user.userId,
    	fromName : user.userName,
      toId : data.userId,
      socketId : data.socketId,
      chatId : data.chatId, 
    	message : data.message,
      time : data.time
    }
    //io.to(data.socketId).emit('chatmessage',data)
    io.emit('chatmessage',jsonData)

    let chat = new app.models.chat();
    chat.insertMessage(app,jsonData)
        
  });

});