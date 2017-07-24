var express = require('express');
var session = require('express-session');
var router = express.Router();
var mongoose = require('mongoose');
var meTube = mongoose.model('metubes');
var sess;
/* GET home page. */
router.route('/')
  .get(function (req, res, next) {
    sess = req.session;
    meTube.find({}, function (err, result) {
      if (err) {
        return console.error(err);
      }
      if (result) {
        res.render('myViews/index', { title: 'MeTube', page: "index", 'allVids': result, header: sess.username });
      }
      if (!result) {
        return console.log("error");
      }
    });
  })

router.get('/categories', function (req, res) {
  sess = req.session;
  meTube.aggregate([
    //{$unwind:"$videosUploaded"},{$project:{_id:0,url:"$videosUploaded.url"}}
    { $unwind: "$videosUploaded" }, { $project: { _id: 0, category: "$videosUploaded.category" } }, { $group: { _id: '$category' } }
  ],
    function (err, result) {
      if (err) {
        return console.error(err);
      }
      if (result) {
        res.render('myViews/index', { title: 'Categories', page: "categories", 'allVids': result, header: sess.username });
      }
      if (!result) {
        return console.log("error");
      }
    });
});

router.get('/categories/:id', function (req, res) {
  sess = req.session;
  var cat = req.params.id;
  meTube.aggregate([
    { $unwind: "$videosUploaded" },
    { $match: { "videosUploaded.category": cat } },
    { $project: { _id: 0, name: "$videosUploaded.name", category: "$videosUploaded.category", url: "$videosUploaded.url" } }
  ],
    function (err, result) {
      if (err) {
        return console.log(err);
      }
      if (result) {
        res.render('myViews/categories', { title: cat, page: "categories", "result": result, header: sess.username });
      }
    });
});

module.exports = router;
