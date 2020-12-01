const axios = require('axios');

// axios.get(`https://api.rawg.io/api/games?key=b3974ef7d1d9487f95346e18cca8d5c4&search=tomb+raider`)
// .then(response => {
//     console.log(response.data.results[1]);
// })

axios.get('https://api.rawg.io/api/games/5286?key=b3974ef7d1d9487f95346e18cca8d5c4')
.then(response => {
    console.log(response);
})