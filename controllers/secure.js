module.exports.set = function(app) {
  // put more app route listings here
  app.get('/',(req,res)=>{
    res.render('login')
  })

  app.post('/logout',(req,res)=>{
    req.session.destroy((err) => {
      if(err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  })
  
  app.post('/',(req,res)=>{
    let json = req.body
    let secure = new app.models.secure()
    resLogin = secure.loginAuth2(req.app,json)
    //app.userData = secure.getAll()
    resLogin.then((result)=>{
      req.session.userData = result.data
      req.session.save()
      res.status(200).json(result)
    })
  })

  app.post('/account',(req,res)=>{
    let json = req.body
    let secure = new app.models.secure()
    resAccount = secure.accountNew2(req.app,json)
    resAccount.then((result)=>{
      res.status(200).json(result)
    })
  })

  app.get('/body',(req,res)=>{
    console.log(req.session)
    res.render('body', {userData: req.session.userData})
  })
}
