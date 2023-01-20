const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy

const pool = require('../db.js');
const { v4: uuidV4 } = require('uuid');

passport.use(new GoogleStrategy({
  clientID: '326018563215-32mp09uoircggear85cf880fi8s9tk8s.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
  async function (request, accessToken, refreshToken, profile, done) {
    const email = profile?._json?.email;
    const name = profile?._json?.name;
    const userName = name.split(" ")[0] + '@' + Math.floor(100 + Math.random() * 900);

    let users = null;
    users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])
    const exist = ((users.rows).map(({ user_email }) => user_email)).toString();
    console.log('exist', exist);


    if (exist === email) {
      return done(null, profile);
    } else {
      try {
        await pool.query('INSERT INTO users (user_name,user_email,user_type) VALUES ($1,$2,$3) RETURNING *', [userName, email, "google-login"]);
        return done(null, profile);
      }
      catch (error) {
        console.log("err", error)
      }
    }
  }));


passport.use(new facebookStrategy({
  // pull in our app id and secret from our auth.js file
  clientID: "706737914223562",
  clientSecret: "f74ddd7de61de0b15ecf207d2b050e93",
  callbackURL: "http://localhost:5000/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

},// facebook will send back the token and profile
  function (token, refreshToken, profile, done) {
    process.nextTick(async function () {
      const email = profile._json.first_name + profile._json.id + '@' + 'gmail.com';
      const userName = profile._json.first_name + '@' + Math.floor(100 + Math.random() * 900);

      let users = null;
      users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])
      const exist = ((users.rows).map(({ user_email }) => user_email)).toString();


      if (exist === email) {
        return done(null, profile);
      } else {
        try {
          await pool.query('INSERT INTO users (user_name,user_email, user_type) VALUES ($1,$2,$3) RETURNING *', [userName, email, "facebook-login"]);
          return done(null, profile);
        }
        catch (error) {
          console.log("err", error)
        }
      }
    })
  }));


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport
