var passport = require('passport');
var util = require('util');
var TwitterStrategy = require('passport-twitter').Strategy;




module.exports = function(app)
{


  passport.use(new TwitterStrategy({
    consumerKey: 'gWD1TrHsFukZk3GLQAViqyoyf',
    consumerSecret: 'MW6vLtyweXTABobyABFHQ4SBR3wX9H7kd5erXRSNP1wfZIQRAT',
    callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get('/request-token',
  passport.authenticate('twitter'));



  app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("came here");
    res.redirect('/');
  });

  app.get('/',function(req,res){

    res.render('index');
  })





}
