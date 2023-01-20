const express = require('express');
const pool = require('../db.js');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authorization.js');

const router = express.Router();


/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    console.log(req.cookies);
    const users = await pool.query('SELECT * FROM users');
    res.json({users : users.rows});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});


router.post('/', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (user_name,user_email,user_password, user_type) VALUES ($1,$2,$3,$4) RETURNING *'
      , [req.body.user_name, req.body.user_email, hashedPassword, "normal"]);
    res.json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.delete('/:id', async (req, res) => {
     try {
             const id = req.params.id
                pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  })

     } catch (error) {
    res.status(500).json({error: error.message});
  }
});



  module.exports = router;

