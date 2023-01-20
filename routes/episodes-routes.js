const express = require('express');
const pool = require('../db.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const episodesList = await pool.query('SELECT * FROM episodes');
        res.json({ episodesList : episodesList.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const uniqueId = Math.floor(100000 + Math.random() * 900000);

        if(!req.body.episodes_name){
            res.status(404).json({ error: "please enter episode name" });
        } else if (!req.body.episodes_url){
            res.status(404).json({ error: "please enter episode url" });
        } else if(!req.body.episodes_icon_url){
            res.status(404).json({ error: "please enter episodes icon url" });
        } else if(!req.body.episodes_relese_date){
            res.status(404).json({ error: "please enter episodes relese date" });
        } 

        const episodesData = await pool.query(
            'INSERT INTO episodes (episodes_id,series_id,episodes_name,episodes_url,episodes_icon_url,episodes_relese_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *'
            , [uniqueId,id,req.body.episodes_name, req.body.episodes_url, req.body.episodes_icon_url,req.body.episodes_relese_date]);
        res.json(episodesData.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let seriesId,episodeName,episodeURL,episodeIconUrl,episodeReleseDate;
        const seriesData = await pool.query('SELECT * FROM episodes WHERE episodes_id = $1', [req.params.id]); 
        
        if( req.body.series_id == null){
            seriesId = seriesData.rows[0].series_id;
        } else {
            seriesId = req.body.series_id;
        }
        if (req.body.episodes_name == null){
            episodeName = seriesData.rows[0].episodes_name;
        } else {
            episodeName = req.body.episodes_name;
        }
        if(req.body.episodes_url == null){
            episodeURL = seriesData.rows[0].episodes_url;
        } else {
            episodeURL = req.body.episodes_url;
        }
        if(req.body.episodes_icon_url == null){
            episodeIconUrl = seriesData.rows[0].episodes_icon_url
        } else {
            episodeIconUrl = req.body.episodes_icon_url;
        }
        if(req.body.episodes_relese_date == null){
            episodeReleseDate = seriesData.rows[0].episodes_relese_date
        } else{
            episodeReleseDate = req.body.episodes_relese_date;
        }

        var cols = [seriesId, episodeName, episodeURL,episodeIconUrl,episodeReleseDate,req.params.id];

        pool.query('UPDATE episodes SET series_id=$1, episodes_name=$2, episodes_url=$3, episodes_icon_url=$4,episodes_relese_date=$5  WHERE episodes_id=$6', cols, function (err, result) {
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
        pool.query('DELETE FROM episodes WHERE episodes_id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`vod deleted with ID: ${id}`)
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// SELECT users.username,
// json_agg(json_build_object('slot', equipment.slot, 'inventory_id', equipment.inventory_id))
// FROM users
// LEFT JOIN equipment ON users.user_id = equipment.user_id
// GROUP BY users.username;
// SELECT 



// SELECT series.series_id, series.series_name , series.series_relese_date, series.series_details, series.series_created_date, episodes.episodes_id, episodes.series_id,
// episodes.episodes_name, episodes.episodes_url, episodes.episodes_icon_url, episodes.episodes_relese_date, episodes.episodes_created_date FROM series LEFT JOIN episodes ON series.seriesId = episodes.episodes_id


router.get('/seriesData', async (req, res) => {
    try {
        const sereisData = await pool.query(`SELECT series.series_id, series.series_name , series.series_relese_date, series.series_details, series.series_created_date
        json_agg(json_build_object('episodes',episodes.episodes_id, episodes.series_id,episodes.episodes_name, episodes.episodes_url, episodes.episodes_icon_url, episodes.episodes_relese_date, episodes.episodes_created_date))
        FROM series LEFT JOIN episodes ON series.series_id = episodes.series_id GROUP BY series.series_name`);
        
        res.json({ series: sereisData.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;