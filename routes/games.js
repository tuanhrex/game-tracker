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

router.post('/played', isLoggedIn, (req, res) => {
  db.game.findOrCreate({
    where: {
      rawg: req.body.gameRawgId
    }
  })

  res.redirect('games/played')
})


router.get('/results', (req, res) => {
    console.log(req.query);
    axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${req.query.game}&page=1&page_size=25`)
    .then(response => {
      let results = response.data.results
      console.log(response.data);
      res.render('games/results', { results })
  
    })
  })

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    axios.get(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`)
    .then(response => {
      console.log(response.data);  
      res.render('games/details' , { game: response.data })
    })
  
  
  
})



module.exports = router;