const express = require('express');
const app = express(); 

const mongoose = require('mongoose');
const Models = require('./model.js'); 
const cors = require('cors');
const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');
 
// mongoose.connect('mongodb://localhost:27017/[myFlixDB]', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'); 

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*'
}));

auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(express.static("public"));

// ENDPOINT FUNCTIONS START //

/**
 * Create user
 * @method post
 * @param {string} endpoint apiUrl/users
 * @param {string} Username set by user (required)
 * @param {string} Password set by user (required)
 * @param {string} Email set by user (required)
 * @param {string} Birthday set by user (optional)
 * @returns {object} User
 * @requires public
 */
app.post('/users',
[
  check('Username', 'Username is required').isLength({ min: 5 }),
  check(
    'Username', 
    'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
(req, res) =>{
  //check validation object for error
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((users) => {
    if(users){
      return res.status(400).send(req.body.Username + "  Already Exists! ");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

/**
 * Get all users
 * @method Get
 * @param {string} endpoint apiUrl/users
 * @returns {object} All users
 */
//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
 
/**
 * Get user by username
 * @method Get
 * @param {string} endpoint apiUrl/users/:Username
 * @param {string} Username required
 * @returns {object} User
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).send('User with the username ' + req.params.Username + 'was not found');
    };    
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Edit user
 * @method put
 * @param {string} endpoint apiUrl/users/:Username
 * @param {string} Username new or current
 * @param {string} Password new or current
 * @param {string} Email new or current
 * @param {string} Birthday new or current
 * @returns {string} success or error message
 */
app.put ('/users/:Username', passport.authenticate('jwt', { session: false}),
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
],
 (req, res) =>{

   //Check the validation object for errors
   let errors = validationResult(req);
   let hashedPassword = undefined;

   if (!errors.isEmpty()) {
     return res.status(422).json({errors: errors.array() });
   }
   if(req.body.hasOwnProperty('Password')){
    hashedPassword = Users.hashPassword(req.body.Password);
   }
    Users.findOneAndUpdate({ Username: req.params.Username }, { 
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      }
    },
    { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
  }
);

/**
 * Add movie to favorites
 * @method post
 * @param {string} endpoint apiUrl/:Username/movies/:MovieID
 * @param {string} Username required
 * @param {string} MovieID required
 * @returns success or error message
 *
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavouriteMovies: req.params.MovieID }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUsers) => {
    res.json(updatedUsers);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Remove movie from favorites
 * @method delete
 * @param {string} endpoint apiUrl/users/:Username/movies/:MovieID
 * @param {string} Username required
 * @param {string} MovieID required
 * @returns {string} success or error message
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
  {  $pull: { FavouriteMovies: req.params.MovieID }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUsers) => {
    res.json(updatedUsers);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * GET movies
 * @method Get
 * @param {string} endpoint apiUrl/users/:Username/movies
 * @param {string} Username required
 * @returns {string} success or error message
 */
app.get('/users/:Username/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    if (user) { // If a user with the corresponding username was found, return user info
      res.status(200).json(user.FavouriteMovies);
    } else {
      res.status(400).send('Could not find favorite movies for this user');
    };
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Delete user
 * @method delete
 * @param {string} endpoint apiUrl/users/:Username
 * @param {string} Username required
 * @returns {string} success or error message
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((users) => {
    if (!users) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix")
})

/**
 * Get all movies
 * @method Get
 * @param {string} endpoint apiUrl/movies
 * @returns {object} all movies
 * @requires JWT authentication
 */  
app.get('/movies', passport.authenticate('jwt', { session: false}), (_req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  }); 
});

/**
 * Get a movie by title
 * @method Get
 * @param {string} endpoint apiURL/movies/:Title
 * @requires JWT authentication
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movies) => {
    res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


/**
 * Get all movies under a genre
 * @method Get
 * @param {string} endpoint apiUrl/movies/genres/:Name
 * @returns {object} movies
 */
app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name}) 
  .then((movies) => {
    if(movies){ 
      res.status(200).json(movies.Genre);
    } else {
      res.status(400).send('Genre not found');
    };
  })
  .catch((err) => {
    res.status(500).send('Error: '+ err);
  });
});

/**
 * Get director information
 * @method Get
 * @param {string} endpoint apiUrl/movies/directors/:Name
 * @returns {object} movies
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name}) 
  .then((movies) => {
    if(movies) { 
      res.status(200).json(movies.Director);
    }else {
      res.status(400).send('Director not found');
    };
  })
  .catch((err) => {
    res.status(500).send('Error: '+ err);
  });
});

// ENDPOINT FUNCTIONS END

// Serves static content for the app from the 'public' directory  
app.use(express.static('public')); 

// Error-handling middleware function that will log all application-level errors to the terminal
app.use((err, _req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});

// Server listens to Port 8080. For HTTP Port 80 is the default Port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () =>{
  console.log('Listening on Port ' + port);
});