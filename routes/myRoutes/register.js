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
        res.render('myViews/register', { title: 'Register' , header : sess.username});
  })

  .post(function(req,res){
    meTube.create({
        username : req.body.username,
        password:req.body.password,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email
      },function(err,result){
      if(err){
        return console.log(err);
      }
      if(result){
        console.log("insertion success");
        res.render('myViews/index',{title:"after insertion" , header : sess.username});
      }
    })
  })


module.exports = router;
