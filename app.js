require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var moment = require('moment');
var md5 = require('md5');
var session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var csrf = require('csurf');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events')

var app = express();

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server); //socket permet d'écouter des événements et de faire une liaison entre navigateur et serveur. on peut recevoir des notifications depuis le serveur.

io.on('connection', socket => { 
console.log('user connected');
socket.on('new-row', data => socket.broadcast.emit('add-row', data) ) //TODO:ajouter l'événemnt new-row. attention, dans la situation actuelle, la notif est envoyée à tous les gens connectés meme sur les autres événements. On peut faire des namespaces et des rooms (voir slides http://nodejs.slides.pierre-jehan.com/#/13/7)

});

server.listen(3001); //ne pas mettre 3000 car il y a déjà le serveur express qui tourne dessus

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//envoi des fonctions aux templates
moment.locale('fr');
app.locals.moment = moment;
app.locals.md5 = md5;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(session({
  secret:'fpiezpjf',
  resave: false,
  saveUninitialized: true
}));
//app.use(csrf({cookie: true}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware pour avoir accès aux infos de user dans tous les fichiers pug
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts', express.static('./node_modules/font-awesome/fonts'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
