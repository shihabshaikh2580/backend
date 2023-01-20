const express = require('express');
const pool = require('../db.js');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    try {

        const livetv = await pool.query('SELECT * FROM vod');
        res.json({ vod: livetv.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newLiveTv = await pool.query(
            'INSERT INTO vod (vod_name,vod_url,vod_image_url, vod_relese_date) VALUES ($1,$2,$3,$4) RETURNING *'
            , [req.body.vod_name, req.body.vod_url, req.body.vod_image_url, req.body.vod_relese_date]);
        res.json(newLiveTv.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var cols = [req.body.vod_name, req.body.vod_url, req.body.vod_image_url, req.body.vod_relese_date, req.params.id];
        pool.query('UPDATE vod SET vod_name=$1, vod_url=$2, vod_image_url=$3,vod_relese_date=$4 WHERE vod_id=$5', cols, function (err, result) {
            if (err) {
                console.log("Error Updating : %s ", err);
            }
            res.status(200).send(`vod detail update sucessfully with ID: ${id}`)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        pool.query('DELETE FROM vod WHERE vod_id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`vod deleted with ID: ${id}`)
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;