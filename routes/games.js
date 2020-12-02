require('dotenv').config();
const express = require('express');
const passport = require('../config/ppConfig');
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/played', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id },
    include: db.game

    
  }).then((user) => {
    // console.log(user);
    // db.game.findAll({
    //   where: {userId: user.id}
    // })
    // .then((allGames => {
    //   console.log(allGames);
    //   res.render('games/played')
    // }))

    if (!user) throw Error()
    db.game.findAll().then((allGames => {
      let playedGames = allGames.filter((cat) => {
        return user.games.map((c) => c.id).includes(cat.id)
      })
      // console.log(playedGames);
      res.render('games/played', {games: playedGames})

    }))
    
  })
})

router.post('/played', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id }
  }).then((user) => {
    db.game.findOrCreate({
      where: {
        rawg: req.body.gameRawgId
      },
      defaults: {
        title: req.body.gameTitle
      }
    }).then((gameReport) => {
      const game = gameReport[0]
      game.addUser(user).then(() => {
        res.redirect('played')

      })
    })
  })
  
})

router.delete('/', isLoggedIn, function (req, res) {
  console.log(req.body);
  db.playedGame.destroy({
      where: {
          userId: req.user.id,
          gameId: req.body.gameId
      }
  })
  .then((_project) => {
      res.redirect('played')
  })
})

router.get('/results', (req, res) => {
    // console.log(req.query);
    axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${req.query.game}&page=1&page_size=25`)
    .then(response => {
      let results = response.data.results
      // console.log(response.data);
      res.render('games/results', { results })
  
    })
  })

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    axios.get(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`)
    .then(response => {
      // console.log(response.data);  
      res.render('games/details' , { game: response.data })
    })
  
  
  
})



module.exports = router;