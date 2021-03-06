# Game Tracker App
Game app that tracks games you have played by searching RAWG.io API. It uses an express authentication template using Passport + flash messages + custom middleware. It uses Moment to get current date and date from seven days before to pull recent releases from API.

## What it includes

* Sequelize user, game, comment, and playedGame model / migration
* Settings for PostgreSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| name | String | Must be provided |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Game Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| title | String | Must be provided |
| rawg | Integer | Must be unique to create new entry |
| imageUrl | String | Must be provided |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### playedGame Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| userId | Integer | Must be provided |
| gameId | Integer | Must be provided |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Comment Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| gameId | Integer | Must be provided |
| userId | Integer | Must be provided |
| comment | String | Must be provided |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### ERD
![ERD](images/erdfinal.png)

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Home page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | server.js | Regular User Profile |

### Game Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /games/results | games.js | Returns search results |
| GET | /games/played | games.js | Display games played |
| GET | /games/:id | games.js | Displays game details |
| POST | /games/played | games.js| Adds game to played |
| DELETE | /games | games.js | Deletes game from played |
| POST | /games/:id/comments | games.js | Adds comment to game |
| GET | /games/comments/edit/:id | games.js | Edit form for comment |
| PUT | /games/comments/:id | games.js | Edits comment |
| DELETE | /games/comments | games.js | Deletes comment |

### User Stories

* As a user, you will be able to create an account and log in.
* As a user, you will able to add games you have played and once added will be redirected to your played list.
* As a user, will be able to leave comments or reviews for the games you have played.

### Technologies

* NodeJS
* Javascipt
* HTML
* CSS

### Code Snippet

##### GET Route for Game Details Page
```js
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

        }).catch(err => {
          console.log(err);
          res.status(400).render('main/404')
      })
      }
      
    })
  })
})
```
##### POST Route to Add Games to Played
```js
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

      }).catch(err => {
        console.log(err);
        res.status(400).render('main/404')
    })
    })
  })
  
})
```





## Steps To Use

#### 1. Go to repo on Github

Repo is found here: [game-tracker](https://github.com/tuanhrex/game-tracker). Alternatively, you can go to this website: [game-tracker-app](https://tuanh-game-tracker.herokuapp.com/)
* Go to the repo above
* `fork` and `clone` the repo


#### 2. Install node modules from the package.json

```
npm install
```

(Or just `npm i` for short)


#### 3. Update `config.json`

* Change the database name to whatever you like or keep it the same
* Other settings are likely okay, but check username, password, and dialect

#### 4. Create a new database for the new project

Using the sequelize command line interface, you can create a new database from the terminal.

```
createdb <new_db_name>
```


#### 5. Run the migrations

```
sequelize db:migrate
```

#### 6. Add a `.env` file with the following fields:

* SESSION_SECRET: Can be any random string; usually a hash in production
* PORT: Usually 3000 or 8000
* API_KEY: Can easily obtain one from [rawg.io](https://rawg.io/apidocs)

#### 7. Run server; make sure it works

```
nodemon
```

or

```
node index.js
```
