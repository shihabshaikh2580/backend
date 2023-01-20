const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users-routes.js');
const bodyparser  = require("body-parser");
const authRouter = require('./routes/auth-routes.js');
const streamRouter = require('./routes/stream-routes.js');
const vodRouter = require('./routes/vod-routes.js');
const seriesRouter = require('./routes/sereies-routes');
const episodesRouter = require('./routes/episodes-routes');

const passport = require("./utils/passport")
const session = require('express-session');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};
app.use(cookieParser());

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(passport.initialize());
app.use(passport.session())

app.use(
	cors({
		origin: "http://localhost:5000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use('/api/users', usersRouter);
app.use('/api/auth',authRouter);
app.use('/api/livetv',streamRouter);
app.use('/api/vod',vodRouter);
app.use('/api/series',seriesRouter);
app.use('/api/episodes',episodesRouter);


app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});


app.get('/fb', (req, res) => {
  res.send('<a href="/auth/facebook">Authenticate with facebook</a>');
});


app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));


app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/protected',
            failureRedirect : '/auth/facebook/failure'
        }));


app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
      }
      req.session.destroy();
      res.send('Goodbye!');
    // res.redirect('/');
  });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
    
app.get('/auth/facebook/failure', (req, res) => {
  res.send('Failed to authenticate..');
});




app.listen(PORT, ()=> {
  console.log(`Server is listening on port:${PORT}`);
})