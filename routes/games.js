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
      
      // db.game.findOne({
      //   where: {
      //     rawg: req.params.id
      //   }
      // }).then((game) => {
      //   if (!game) throw Error
      //   db.comment.findAll({
      //     where: {
      //       gameId: game.id
      //     }, include: db.user
      //   }).then((comments) => {


      //     res.render('games/details' , { game: response.data , comments: comments})
      // }).catch((error) =>{
      //   console.log(error);
        res.render('games/details', { game: response.data})
      // })

      // })

// saasdas

      // db.game.findOne({
      //   where: { id: req.params.id },
      //   include:  db.comment
        
      // }).then((game) => {
      //   if (!game) throw Error()
      //   const comments = game.comments
      //   res.render('games/details', { game: response.data, comments: comments})
      // }).catch((error) => {
      //   res.render('games/details', { game: response.data })
      // })
      
    })
  
})

// router.get('/:id',  (req, res) => {
//   axios.get(`https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`)
//   .then(response => {


//     db.game.findOne({
//       where: { rawg: req.params.id },
//       include: db.comment
  
      
//     }).then((game) => {
      
//       if (!game) throw Error()
//       db.comment.findAll().then((allComments => {
//         let gameComments = allComments.filter((cat) => {
//           return game.comments.map((c) => c.id).includes(cat.id)
//         })
//         // console.log(playedGames);
//         res.render('games/played', {comments: gameComments})
  
//       }))
      
//     })
//   })
// })


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
    })
    
  })
  res.redirect(`/games/${req.body.gameRawgId}`)
})


module.exports = router;