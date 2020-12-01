require('dotenv').config();
const express = require('express');
const passport = require('../config/ppConfig');
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/played', isLoggedIn, (req, res) => {
    res.render('games/played')
})



router.get('/:id', (req, res) => {
    console.log(req.params.id);
    axios.get(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`)
    .then(response => {
      console.log(response.data.platforms);  
      res.render('games/details' , { game: response.data })
    })
  
  
  
})



module.exports = router;