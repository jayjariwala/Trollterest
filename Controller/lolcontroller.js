var passport = require('passport');
var util = require('util');
var Strategy = require('passport-twitter').Strategy;
var mongoose= require('mongoose');
var model = require('../model/lolterestModel');
var connection=model.getConnection();
var user=model.createSchema(connection);
var userLikes= model.createUserLikeSchema(connection);



module.exports = function(app)
{


  passport.use(new Strategy({
      consumerKey: 'gWD1TrHsFukZk3GLQAViqyoyf',
      consumerSecret: 'MW6vLtyweXTABobyABFHQ4SBR3wX9H7kd5erXRSNP1wfZIQRAT',
      callbackURL: 'https://lolterest.herokuapp.com/login/twitter/return'
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
    var uid=req.session.user.id;
    var uname=req.session.user.username;
    var timestamp = Math.floor(Date.now() /1000);
    var processid= process.pid;
    var ranNum = Math.random() * (100 - 0) + 100;
    var sid= timestamp+processid+ranNum;

    var user_image = new user({
      uid: uid,
      uname:uname,
      pic_id:sid,
      pic_url:image,
      pic_title:title,
      time:timestamp,
      stars:0,
      star_status:'nostar'
    });

    user_image.save(function(err){
              if(err) throw err;
              console.log("information stored successfully");
              user.find({},{'time':0},function(err,data){
                  res.send({user:req.session.user,pictures:data});
              }).sort({'time':-1});

            });

})
app.post('/userimg',function(req,res){
    var u_id=req.body.id;

    user.find({uid:u_id},{'time':0},function(err,data){
      console.log("DATA>>>>>>>"+data);
      res.send(data);
    }).sort({'time':-1});


});

app.post('/delimg',function(req,res){

    var value=req.body.value;
    var realu=req.session.user.id;
      user.findOneAndRemove({pic_id: value, uid:realu},function(err,docs){
      if(err) throw err;
      res.send("succes");
    })


});
app.post("/like",function(req,res){

  var value=req.body.value;
  var realu=req.session.user.id;



  userLikes.count({pic_id:value,uid:realu},function(err,data){
    if(!data ==0)
    {
      console.log("DOC FOUND");
       userLikes.findOneAndRemove({pic_id: value, uid:realu},function(err,docs){
      if(err) throw err;
      userLikes.count({pic_id:value},function(err,senddata){



            var query={ pic_id:value}
          user.update(query,{ $set: {stars:senddata}}, function(data){

            user.count({pic_id:value,uid:realu},function(err,datacount){

              console.log("The value of count>>>>>>>>>>>"+datacount);
              var obj={
                likes:senddata,
                status:"unstar"
              }
                if(!datacount == 0)
                {
                  user.update({uid:realu,pic_id:value},{ $set: {star_status:'nostar'}},function(done){
                    console.log("Yes updated");
                    res.send(obj);
                  })
                }
                else {
                    res.send(obj);
                }


            })






      })


      });

    });

    }
    else
    {
      console.log("NO DOC FOUND");
      var likes = new userLikes({
        pic_id:value,
        uid:realu
      });
      likes.save(function(err){
                if(err) throw err;
                console.log("information stored successfully");
                userLikes.count({pic_id:value},function(err,senddata){
                  var query={ pic_id:value}
                user.update(query,{ $set: {stars:senddata}}, function(data){


                  console.log("pic id>>>>>>>>"+value);
                  console.log("user id>>>>>"+realu);
                  user.count({pic_id:value,uid:realu},function(err,datacount){

                    console.log("The value of count>>>>>>>>>>>"+datacount);
                    var obj={
                      likes:senddata,
                      status:"star"
                    }
                      if(!datacount == 0)
                      {
                        user.update({uid:realu,pic_id:value},{ $set: {star_status:'yesstar'}},function(done){
                          console.log("Yes updated");
                          res.send(obj);
                        })
                      }
                      else {
                          res.send(obj);
                      }


                  })




            })
                  //update main model count value

                });
              });
    }
  });




});
app.post('/mypostimg',function(req,res){
    var usrid=req.session.user.id;
    var title = req.body.title;
    var image= req.body.image;
    var uid=req.session.user.id;
    var uname=req.session.user.username;
    var timestamp = Math.floor(Date.now() /1000);
    var processid= process.pid;
    var sid= timestamp+processid+ranNum;

    var user_image = new user({
      uid: uid,
      uname:uname,
      pic_id:sid,
      pic_url:image,
      pic_title:title,
      time:timestamp,
      stars:0
    });

    user_image.save(function(err){
              if(err) throw err;
              console.log("information stored successfully");
              user.find({uid:usrid},{'time':0},function(err,data){
                  res.send({user:req.session.user,pictures:data});
              }).sort({'time':-1});

            });

})






app.get('/mylols',function(req,res){

  var usrid=req.session.user.id;
console.log("USER ID >>>"+usrid);
  user.find({uid:usrid},{'time':0},function(err,data){
    console.log("DATA>>>>>>>"+data);
    res.render('mylols',{user:req.session.user,pictures:data});
  }).sort({'time':-1});


});

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
      user.find({},{'time':0},function(err,data){
        console.log("DATA>>>>>>>"+data);
        res.render('index',{user:req.session.user,pictures:data});
      }).sort({'time':-1});

    }
    else {
      user.find({},{'time':0},function(err,data){
        console.log("DATA>>>>>>>"+data);
          res.render('index',{user:0,pictures:data});
      }).sort({'time':-1});

    }

  })





}
