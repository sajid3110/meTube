var express = require('express');
var session = require('express-session');
var router = express.Router();
var mongoose = require('mongoose');
var meTube = mongoose.model('metubes');
var sess;
/* GET home page. */
router.route('/')
.get(function(req, res, next) {
  sess = req.session;
  if(sess.username){
    res.redirect("/myHome");
  }
  else{
    res.render('myViews/login', { title: 'Login Page' , header : session.username});
  }
})

.post(function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  sess = req.session;
  meTube.findOne({
    username : username,
    password : password
  },
  function(err,result){
    if(err){
      console.log(err);
      res.render('error');
    }
    if(result){
      sess.username = username;
      res.redirect("/");
    }
    if(!result){
      res.status(500).send("you have entered wrong login credentials!");
      console.log('login credentials are wrong!');
    }
  });
});

module.exports = router;
