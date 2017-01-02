var passport = require('passport');
var util = require('util');
var Strategy = require('passport-twitter').Strategy;
var mongoose= require('mongoose');
var model = require('../model/lolterestModel');
var connection=model.getConnection();
var user=model.createSchema(connection);



module.exports = function(app)
{


  passport.use(new Strategy({
      consumerKey: 'gWD1TrHsFukZk3GLQAViqyoyf',
      consumerSecret: 'MW6vLtyweXTABobyABFHQ4SBR3wX9H7kd5erXRSNP1wfZIQRAT',
      callbackURL: 'http://127.0.0.1:8080/login/twitter/return'
    },
    function(token, tokenSecret, profile, cb) {
      // In this example, the user's Twitter profile is supplied as the user
      // record.  In a production-quality application, the Twitter profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }));


  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Twitter profile is serialized
  // and deserialized.
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');

})
app.post('/postimg',function(req,res){
    var title = req.body.title;
    var image= req.body.image;
    var story= req.body.story;
    var uid=req.session.user.id;
    var uname=req.session.user.username;
    var timestamp = Math.floor(Date.now() /1000);
    var processid= process.pid;
    var ranNum = Math.random() * (100 - 0) + 100;
    var sid= timestamp+''+processid+''+ranNum;

    var user_image = new user({
      uid: uid,
      uname:uname,
      pic_id:sid,
      pic_url:image,
      pic_title:title,
      pic_desc:story
    });

    user_image.save(function(err){
              if(err) throw err;
              console.log("information stored successfully");
              

            });


  res.send("abc");

})
app.get('/login/twitter',
  passport.authenticate('twitter'));


  app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      req.session.user= req.user;
      console.log("Request Values>>>>>> "+req.user.username);
      res.redirect('/');
    });

  app.get('/',function(req,res){
    if(req.session.user)
    {
      console.log("Print this"+req.session.user.username);
      res.render('index',{user:req.session.user});
    }
    else {
        res.render('index',{user:0});
    }

  })





}
