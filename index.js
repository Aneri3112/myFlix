const express = require('express'),
     morgan = require('morgan'),
     bodyParser = require('body-parser');
     uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./model.js'); 

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/[myFlixDB]', { useNewUrlParser: true, useUnifiedTopology: true });


//CREATE
app.post('/users', (req, res) =>{
    Users.findOne({ Username: req.body.Username })
      .then((users) => {
        if(users){
  
        return res.status(400).send(req.body.Username + "  has been created ! ");
  
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((users) => {
            res.status(201).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + error);
              })
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
      });
  });
  

//UPDATE
app.put ('/users/:Username', (req, res) =>{
    Users.findOneAndUpdate({ User: req.params.Username }, { 
      $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        }
      },
      { new:true }) 
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
      });
    });

//CREATE
app.patch('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavouriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedusers) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedusers);
        }
    });
});

//DELETE
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
    {  $pull: { FavouriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedusers) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedusers);
        }
    });
});

//DELETE
app.delete('/users/:Username', (req, res) => {
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

//Read
app.get("/", (req, res) => {
    res.send("Welcome to myFlix")
})

//Return a list of ALL movies to the user    
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    }); 
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


//Return data about a genre
app.get('/movies/genre/:Name', (req, res) => {
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

//Return data about a director
app.get('/movies/director/:Name', (req, res) => {
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



//Static File  
app.use(express.static('public')); 

//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});

//Listen for request
app.listen(8080, () =>{
    console.log('Your app is listening on port 8080.');
});