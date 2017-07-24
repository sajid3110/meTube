var mongoose = require('mongoose');
var myTubeSchema = new mongoose.Schema({
  username : String,
  password: String,
  firstname : String,
  lastname : String,
  email : String,
  videosUploaded : [{
    vid : Number,
    name : String,
    url : String,
    category : String,
    date : {type : Date , default : Date.now()},
    format : String
  }]
});

mongoose.model('metubes' , myTubeSchema);
