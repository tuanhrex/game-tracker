const axios = require('axios');
require('dotenv').config();
const express = require('express');

const db = require('./models');





// axios.get(`https://api.rawg.io/api/games?key=b3974ef7d1d9487f95346e18cca8d5c4&search=tomb+raider`)
// .then(response => {
//     console.log(response.data.results[1]);
// })

// axios.get('https://api.rawg.io/api/games/5286?key=b3974ef7d1d9487f95346e18cca8d5c4')
// .then(response => {
//     console.log(response);
// })

axios.get(`https://api.rawg.io/api/games/16?key=b3974ef7d1d9487f95346e18cca8d5c4`)
  .then(response => {
    db.game.findOne({
      where: { rawg: 16 }
    }).then((game) => {
        console.log(!game);
    //   if (!game) {
    //     res.render('games/details', { game: response.data})
    //   }
    //   else db.comment.findAll({
    //     where: { gameId: game.id},
    //     include: [db.game, db.user]
    //   }).then((comments) => {
    //     res.render('games/details', { game: response.data, comments: comments})
    //   })
    // })
  })
  })