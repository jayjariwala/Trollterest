var express=require('express');
var app= express();
var controller=require('./Controller/lolcontroller');
var session=require('express-session');
app.set('view engine','ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
}));



app.use(express.static('./public'))
controller(app);




var port= Number(process.env.PORT || 8080);
app.listen(port);
