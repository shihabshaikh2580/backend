const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwtTokens = require('../utils/jwt-helpers.js');
const passport = require('passport');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
//    console.log(req.cookies, req.get('origin'));
    const { email, password } = req.body;
    const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    //PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
    if (!validPassword) return res.status(401).json({error: "Incorrect password"});

    //JWT
    let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    let userDetail = users.rows[0];
    res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});

    res.json({userDetail,tokens});
  } catch (error) {
    res.status(401).json({error: error.message});
  }

});


router.get('/refresh_token', (req, res) => {
  try {
    const authHeader = req.headers['refresh_token']; //Bearer TOKEN
      const refreshToken = authHeader && authHeader.split(' ')[1];

    console.log(refreshToken);
    if (refreshToken === null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({error:error.message});
      let tokens = jwtTokens(user);
      res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
      return res.json(tokens);
    });
    } catch (error) {
    res.status(401).json({error: error.message});
  }
});

router.delete('/refresh_token', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({message:'Refresh token deleted.'});
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});



  module.exports = router;
