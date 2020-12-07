require('dotenv').config();
const express = require('express');
const passport = require('../config/ppConfig');
const db = require('../models');
const router = express.Router();
const axios = require('axios');
const methodOverride = require('method-override')
const isLoggedIn = require('../middleware/isLoggedIn');

router.use(methodOverride('_method'))

router.get('/played', isLoggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id },
    include: db.game

    
  }).then((user) => {
  
    if (!user) throw Error()
    db.game.findAll().then((allGames => {
      let playedGames = allGames.filter((cat) => {
        return user.games.map((c) => c.id).includes(cat.id)
      })
     
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
        title: req.body.gameTitle,
        imageUrl: req.body.gameImage
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
   
    axios.get(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${req.query.game}&page=1&page_size=25`)
    .then(response => {
      let results = response.data.results
      
      res.render('games/results', { results })
  
    })
  })

router.get('/comments/edit/:id', isLoggedIn, (req, res) => {
  db.comment.findOne({
    where: {
      id: req.params.id
    }
  }).then((comment) =>{
    res.render('games/edit', { comment: comment})
  })
})

router.delete('/comments', isLoggedIn, function (req, res) {
  
  db.comment.destroy({
      where: {
          id: req.body.commentId
      }
  })
  .then((_project) => {
      db.game.findOne({
        where: {
          id: req.body.gameId
        }
      }).then((game) => {

        res.redirect(`/games/${game.rawg}`)
      })
  })
})




router.put('/comments/:id', (req, res) => {
  db.comment.update({
    comment: req.body.content
  }, {
    where: {
      id: req.params.id
    }
  }).then(numRowsChanged => {
    
    db.comment.findOne({
      where: { 
        id: req.params.id
      }
    }).then((comment) => {
      db.game.findOne({
        where: {
          id: comment.gameId
        }
      }).then((game) => {
        
        res.redirect(`/games/${game.rawg}`)
      })
    })
  })

})


router.get('/:id', (req, res) => {
  axios.get(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`)
  .then(response => {
    db.game.findOne({
      where: { rawg: req.params.id }
    }).then((game) => {
      
      if (!game) {
        // had to set an empty array for comments because the details ejs uses comments
        let comments = []
        res.render('games/details', { game: response.data, comments: comments})
      }
      else {
      
      
        db.comment.findAll({
          where: { gameId: game.id},
          include: [db.game, db.user]
        }).then((comments) => {
        
          
          
          res.render('games/details', { game: response.data, comments: comments})

        })
      }
      
    })
  })
})



router.post('/:id/comments', isLoggedIn, (req,res) => {
  console.log(req.body)
  db.game.findOrCreate({
    where: {
      rawg: req.body.gameRawgId
    }, 
    defaults: {
      title: req.body.gameTitle,
      imageUrl: req.body.gameImage
    }
  }).then((game) => {
    // Repetitive but it was the only way I was able to make it save gameId after creating a new game
    db.game.findOne({
      where: {
        rawg: req.body.gameRawgId
      }
    }).then((found) => {
      db.comment.create({
        gameId: found.id,
        userId: req.user.id,
        comment: req.body.content
      })
      res.redirect(`/games/${req.body.gameRawgId}`)
    })
    
  })
})


module.exports = router;