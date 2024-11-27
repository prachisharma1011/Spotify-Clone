const express = require('express');
const router = express.Router();
const { getAllSongs, serveSong } = require('../controllers/songsController');
// const { getAllSongs2, serveSong2 } = require('../controllers/songsKedarnath');

// Route to get all songs
// router.get('/list', getAllSongs);


router.post('/list',getAllSongs);


module.exports = router;
