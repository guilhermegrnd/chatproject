module.exports.set = function(app) {

  app.post('/chat/getusers',(req,res)=>{
    res.status(200).json(app.usersConnected)
  })

  app.post('/chat/getmessages',(req,res)=>{
    let json = req.body
    let chat = new app.models.chat();
    let chatRet = chat.findMessages(app,json)
    chatRet.then((result)=>{
      // req.session.userData = result.data
      // req.session.save()
      res.status(200).json(result)
    })
  })
}