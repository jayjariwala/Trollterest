var passport = require('passport');
var util = require('util');
var Strategy = require('passport-twitter').Strategy;




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


app.get('/login/twitter',
  passport.authenticate('twitter'));


  app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      console.log("Request Values>>>>>> "+req.user.username);
      res.redirect('/');
    });

  app.get('/',function(req,res){

    res.render('index');
  })





}
