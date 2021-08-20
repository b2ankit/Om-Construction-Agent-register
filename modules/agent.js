var mongoose = require('mongoose');
var dburl = "mongodb://localhost:27017/agent";
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true});
var ab_agent = mongoose.connection;

var agentSchema = new mongoose.Schema({
    name : String,
    address : String,
    mobile : Number,
    // bag : Number,
    // weight : Number, 
})

var agent_obj = mongoose.model('agent',agentSchema);

module.exports = agent_obj;