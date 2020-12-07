require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const axios = require('axios');
const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION)
const app = express();
const moment = require('moment')
// isLoggedIn middleware

const isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


// secret: What we actualy will be giving the user on our site as a session cookie
// resave: Save the session even if its been modified, make this false
// saveUninitialized: if we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}

let today = moment().format('YYYY-MM-DD')
let oneWeekAgo = moment().subtract(3,'d').format('YYYY-MM-DD')

app.use(session(sessionObject));


// Initialize pass and run through middleware
app.use(passport.initialize());
app.use(passport.session());


// Flash!!
// Using flash throughout app to send temp messages to user
app.use(flash());

// Messages that will be accessible to every view
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&dates=${oneWeekAgo},${today}`)
  .then(response => {
    // console.log(response.data.results);
    let results = response.data.results
    console.log(res.locals.alerts);
    res.render('index', { alerts: res.locals.alerts, results });
  })
});

app.get('/profile', isLoggedIn, (req, res) => {
  const user = req.user
  res.render('profile', { user });
});


app.use('/auth', require('./routes/auth'));
app.use('/games', require('./routes/games'));

app.get('/*', (req, res) => {
  res.render('404')
})




const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});


module.exports = server;
