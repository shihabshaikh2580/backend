const express = require('express');
const pool = require('../db.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const livetv = await pool.query('SELECT * FROM series');
        res.json({ series: livetv.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//series

router.post('/', async (req, res) => {
    try {
        const uniqueId = Math.floor(100000 + Math.random() * 900000);

        if(!req.body.series_name){
            res.status(404).json({ error: "please enter series name" });
        } else if (!req.body.series_relese_date){
            res.status(404).json({ error: "please enter series relese date" });
        } else if (!req.body.series_details){
            res.status(404).json({ error: "please enter series details" });
        } 

        const seriesData = await pool.query(
            'INSERT INTO series (series_id,series_name,series_relese_date,series_details) VALUES ($1,$2, $3, $4) RETURNING *'
            , [uniqueId,req.body.series_name, req.body.series_relese_date, req.body.series_details]);
        res.json(seriesData.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
     
        let seriesName,seriesReleseDate,SeriesDetails;
        const users = await pool.query('SELECT * FROM series WHERE series_id = $1', [req.params.id]); 
    
        if(req.body.series_name == null){
            seriesName = users.rows[0].seriesName;
        } else {
            seriesName = req.body.series_name;
        }
        
        if(req.body.series_relese_date == null){
            seriesReleseDate = users.rows[0].series_relese_date
        } else{
            seriesReleseDate = req.body.series_relese_date;
        }

        if(req.body.series_details == null){
            SeriesDetails = users.rows[0].series_details;
        } else{
            SeriesDetails = req.body.series_details;
        }

        var cols = [seriesName, seriesReleseDate,SeriesDetails,req.params.id];

        pool.query('UPDATE series SET series_name=$1, series_relese_date=$2, series_details=$3 WHERE series_id=$4', cols, function (err, result) {
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
        pool.query('DELETE FROM series WHERE series_id = $1', [id], (error, results) => {
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