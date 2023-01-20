const express = require('express');
const pool = require('../db.js');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    try {

        const livetv = await pool.query('SELECT * FROM livetv');
        res.json({ livetv: livetv.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newLiveTv = await pool.query(
            'INSERT INTO livetv (channel_name,channel_URL,channel_icon_url) VALUES ($1,$2,$3) RETURNING *'
            , [req.body.channel_name, req.body.channel_URL, req.body.channel_icon_url]);
        res.json(newLiveTv.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {

        const id = req.params.id;
        pool.query("DELETE FROM livetv WHERE channel_id=$1", [id], function (err, rows) {
            if (err) {
                throw err
            }
            res.status(200).send(`channel deleted with ID: ${id}`)
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var cols = [req.body.channel_name, req.body.channel_url,req.body.channel_icon_url,req.params.id];
        pool.query('UPDATE livetv SET channel_name=$1, channel_url=$2, channel_icon_url=$3 WHERE channel_id=$4', cols, function (err, result) {
            if (err) {
                console.log("Error Updating : %s ", err);
            }
            res.status(200).send(`channel detail update sucessfully with ID: ${id}`)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;