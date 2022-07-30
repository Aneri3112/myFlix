const express = require('express');
const app = express(); 

const mongoose = require('mongoose');
const Models = require('./model.js'); 
const cors = require('cors');
const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');
 
// mongoose.connect('mongodb://localhost:27017/[myFlixDB]', { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect(process.env.CONNECTION_URI || "mongodb://localhost:27017/[myFlixDB]", { useNewUrlParser: true, useUnifiedTopology: true });

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

//CORS to limit origins for application
/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://myflixspecial.netlify.app', 'http://localhost:1234', 'http://localhost:4200'];
app.use(cors({
	origin: (origin, callback) => {
		if(!origin) return callback(null, true);
		if(allowedOrigins.indexOf(origin) === -1){
			let message = 'The CORS policy for this application does not allow access from origin ' + origin;
			return callback(new Error(message), false);
		}
		return callback(null, true);
	}
})); */

auth = require('./auth')(app);
const passport = require('passport');
    require('./passport');

app.use(express.static("public"));


/* ******* START OF ENDPOINT DEFINITION ******* 
************************************************
************************************************
*/

 /**
 * POST: Allows new users to register; Username, Password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
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
 * GET: Returns a list of ALL users
 * Request body: Bearer token
 * @returns array of user objects
 * @requires passport
 */
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
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
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
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
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
});

/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns user object
 * @requires passport
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
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
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
 * GET: Returns a list of favorite movies from the user
 * Request body: Bearer token
 * @param Username
 * @returns array of favorite movies
 * @requires passport
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
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
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

/**
 * GET: Returns welcome message for '/' request URL
 * @returns Welcome message
 */
app.get("/", (req, res) => {
    res.send("Welcome to myFlix")
})

/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @returns array of movie objects
 * @requires passport
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
 * GET: Returns data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
 * Request body: Bearer token
 * @param movieId
 * @returns movie object
 * @requires passport
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
 * GET: Returns data about a genre (description) by name/title (e.g., “Fantasy”)
 * Request body: Bearer token
 * @param Name (of genre)
 * @returns genre object
 * @requires passport
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
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param Name (of director)
 * @returns director object
 * @requires passport
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

/* ******* END OF ENDPOINT DEFINITION ******* 
************************************************
************************************************
*/

/**
 * Serves sstatic content for the app from the 'public' directory
 */  
app.use(express.static('public')); 

/**
 * handles errors
 */
app.use((err, _req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});

/**
 * defines port, listening to port 8000
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () =>{
    console.log('Listening on Port ' + port);
});