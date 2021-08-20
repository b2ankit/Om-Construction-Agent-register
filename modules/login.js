var mongoose = require('mongoose');
var dburl = "mongodb://localhost:27017/agent";
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true});
var login = mongoose.connection;

var loginSchema = new mongoose.Schema({
    username : String,
    password : String, 
})

var login_obj = mongoose.model('login',loginSchema);

module.exports = login_obj;