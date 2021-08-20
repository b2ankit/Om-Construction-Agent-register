var express = require('express');
var login_obj = require('../modules/login');
var agent_obj = require('../modules/agent');
var jwt = require('jsonwebtoken');
var router = express.Router();

var find_agent = agent_obj.find({});


/** Linking Static Files */
router.use(express.static(__dirname + "./public"));

//Require node localStorage npm
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/** Defining the Middleware function for Login check */

function checkloginUser(req,res,next){
  var user_name = localStorage.getItem('username');
  if(user_name == null){
    res.render('welcome',{title:'welcome',isLogin : 0});
  }
  next();
}

/** -------------------------------------------------------------------------- */
/* GET home page. */
router.get('/', function(req, res, next) {
  var user_name = localStorage.getItem('username');
  if(user_name == null){
    res.render('welcome',{title:'welcome',isLogin : 0});
  }
  res.render('welcome', { title: 'Welcome',isLogin : 1});
});

/** -------------------------------------------------------------------------- */
router.get('/index', checkloginUser, function(req, res, next) {
  var find_all = agent_obj.find({});
  find_all.exec(function(err,data){
    if(err)
    throw error;

    res.render('index', { title: 'Agent',records:data});
  })


});
/** -------------------------------------------------------------------------- */
/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login Form',status : '' });
});

/** -------------------------------------------------------------------------- */
// router.post('/login',function(req,res,next){

//   var login = new login_obj({
//     username : req.body.username,
//     password : req.body.password,
//   });

//   login.save(function(err){
//     if(err) 
//     throw error;
//     console.log("Login Successfully inserted");
//     res.send('/');
//   })

// });


router.post('/login',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;

  var loginFilter = login_obj.findOne({$and : [{username : username},{password:password}]});
  loginFilter.exec(function(err,data){
    if(err)
    {
     
      throw error;
    }
    else
    {
      if(data != null)
      {
        var uname = data.username;
        var user_id = data.id;

        //start the Token
        var token = jwt.sign({userId : user_id},'loginToken');

        //save signin Token in local Storage
        localStorage.setItem('userToken',token);
        localStorage.setItem('username',uname);
        
        var find_agent_login = agent_obj.find({});
        find_agent_login.exec(function(err,data1){
          if(err)
          throw error;
      
        res.render('index', { title: 'Agent',records:data1});
      });
      }
      else{
        res.render('login', { title: 'login Form',status : 'FAIL' })
      }

    }
  });
});


/** -------------------------------------------------------------------------- */
/* GET home page. */
router.get('/add',checkloginUser, function(req, res, next) {
  res.render('add', { title: 'Add' });
});

/** -------------------------------------------------------------------------- */
router.post('/add',function(req,res,next){

 var agent = new agent_obj({
   name : req.body.name,
   address : req.body.address,
   mobile : req.body.mobile,
 });

 agent.save(function(err){
   if (err)
   throw error;
  
   find_agent.exec(function(err,data){
     if(err)
      throw error;
     res.render('index', { title: 'Agent',records : data });
   });
 });
 

});

/** -------------------------------------------------------------------------- */
/* GET home page. */
router.get('/delete/:id', function(req, res, next) {
  var agent_id = req.params.id;
  var delete_agent = agent_obj.findByIdAndDelete(agent_id);
  delete_agent.exec(function(err){
    if(err)
      throw error;

      find_agent.exec(function(err,data){
        if(err)
         throw error;
        res.render('index', { title: 'Agent',records : data });
      });

  });

});

/** -------------------------------------------------------------------------- */
/* GET home page. */
router.get('/edit/:id', function(req, res, next) {
  var agent_id = req.params.id;
  var edit_agent = agent_obj.findById(agent_id);
  edit_agent.exec(function(err,data){
    if(err)
      throw error;

      res.render('update', { title: 'Agent',records : data });

  });

});

/** -------------------------------------------------------------------------- */
/* GET home page. */
router.post('/update', function(req, res, next) {
  var agent_id = req.body.id;
  var update_agent = agent_obj.findByIdAndUpdate(agent_id,{
    name : req.body.name,
    address : req.body.address,
    mobile : req.body.mobile,
  });
  update_agent.exec(function(err){
    if(err)
      throw error;

      find_agent.exec(function(err,data){
        if(err)
         throw error;
        res.render('index', { title: 'Agent',records : data });
      });

  });

});

router.post("/search",function(req,res,next){
  var search_input = req.body.input;
  var filter_input = find_agent.find({$and:[{name : search_input}]});
  filter_input.exec(function(err,data){
    if(err)
    throw error;
      res.render('index',{ title: 'Agent',records : data });
  })
})


router.get('/logout',checkloginUser,function(req,res,next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('username');
  res.render('welcome',{title:'welcome',isLogin : 0});
});



/** -------------------------------------------------------------------------- */
module.exports = router;
