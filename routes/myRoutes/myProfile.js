var express = require('express');
var session = require('express-session');
var router = express.Router();
var mongoose = require('mongoose');
var meTube = mongoose.model('metubes');
var sess;



router.route('/')
  .get(function (req, res) {
    sess = req.session;
    meTube.findOne({
      username: sess.username
    },
      function (err, result) {
        if (err) {
          res.status(500).send("there was an error in profile retrieval");
        }
        if (result) {
          res.render('myViews/myProfile', { username: sess.username, data: result, header: sess.username });
        }
        if (!result) {
          res.status(500).send("user not found");
        }
      }
    );

  })

router.route("/logout")
  .get((req , res) => {
    sess = req.session.destroy();
    res.redirect("/");

  })

router.route('/update')
  .get(function (req, res) {
    sess = req.session;
    res.render("myViews/updateProfile", { username: sess.username, header: sess.username });
  })

  .post(function (req, res) {
    var id = sess.username;
    console.log(id);
    meTube.findOne({
      username: id
    },
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send();
        }
        else if (!result) {
          console.log("user not found");
          res.status(500).send("No such user found");
        }
        else if (result) {
          if (req.body.firstname) { result.firstname = req.body.firstname; }
          if (req.body.lastname) { result.lastname = req.body.lastname; }
          if (req.body.email) { result.email = req.body.email; }
          if (req.body.password) { result.password = req.body.password; }

          result.save(function (err, updatedresult) {
            if (err) {
              console.log("result update error");
              res.status(500).send('result update error');
            }
            else {
              meTube.update({ username: id }, updatedresult, function (err, finalresult) {
                if (err) {
                  console.log("db update error");
                  res.status(500).send('db update error');
                }
                else {
                  res.render("myViews/myProfile", { username: sess.username, data: updatedresult, header: sess.username });
                }
              })

            }
          })
        }
      }
    )

  })

router.route("/myUploads")
  .get((req, res) => {
    sess = req.session;
    meTube.aggregate([
      { $match: { username: sess.username } },
      { $unwind: "$videosUploaded" },
      { $project: { name: "$videosUploaded.name", category: "$videosUploaded.category", url: "$videosUploaded.url", vid: "$videosUploaded.vid", format: "$videosUploaded.format", date: "$videosUploaded.date" } }
    ], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("There was an error fetching the data");
      }
      else if (!result) {
        res.render("myViews/myUploads", { "videos": 0, username: sess.username, header: sess.username });
      }
      else if (result) {
        console.log(result);
        res.render("myViews/myUploads", { "videos": result, username: sess.username, header: sess.username });
      }
    })

  });

  router.route("/myUploads/new_upload")
  .get((req , res) => {
    sess = req.session;
    res.render("myViews/new_upload", { username: sess.username, header: sess.username });
  })

module.exports = router;
