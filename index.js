const express = require('express'),
     morgan = require('morgan'),
     bodyParser = require('body-parser');
     uuid = require('uuid');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let topmovies = [
    {
        title: 'Life Is Beautiful(1997)',
        director: 'Roberto Benigni',
        genre:  {
            genreName:'Drama, Comedy, War'
        }
    },
    {
        title: 'Inception(2010)',
        director: 'Christopher Nolan',
        genre:  {
            genreName:'Sci-Fi'
        }
    },
    {
        title: 'The Dark Knight(2008)',
        director: 'Christopher Nolan',
        genre:  {
            genreName:'Action, Crime, Drama'
        }
    },
    {
        title: 'Joker',
        director: 'Todd Phillips',
        genre:  {
            genreName:'Thriller, Crime'
        }
    },
    {
        title: '3 Idiots',
        director: 'Rajkumar Hirani',
        genre:  {
            genreName:'Comedy, Drama'
        }
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg',
        genre:  {
            genreName:'Sci-Fi, Adventure'
        }
    },
    {
        title: 'The Pursuit of Happyness',
        director: 'Gabriele Muccino',
        genre:  {
            genreName:'Biography'
        }
    },
    {
        title: 'In Time',
        director: 'Andrew Niccol',
        genre:  {
            genreName:'Sci-Fi'
        }
    },
    {
        title: 'Gandhi',
        director: 'Richard Attenborough',
        genre:  {
            genreName:'Biography'
        }
    },
    {
        title: 'Interstellar',
        director: 'Christopher Nolan',
        genre:  {
            genreName:'Sci-Fi'
        }
    }

];

app.get("/", (req, res) => {
    res.send("Welcome to myFlix")
})

//Return a list of ALL movies to the user    
app.get('/movies', (req, res) => {
    res.status(200).json(topmovies);
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topmovies.find(movie => movie.title === title);

    if(movie) {
        res.status(200).json(movie);
    } else 
        res.status(400).send('no such movie');
});


//Return data about a genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = topmovies.find(movie => movie.genreName === genreName ).genre;

    if (genre) {
        res.status(200).json(genre);
    } else
    res.status(400).send('no such genre')
});

//Return data about a director
app.get('/movies/directors/:directorname', (req, res) => {
    const { directorName } = req.params;
    const director = topmovies.find(movie => movie.director === directorName ).director;

    if (director) {
        res.status(200).json(director);
    } else 
    res.status(400).send('no such director')  
});

//Allow new users to register
app.post('/users/register', (req, res) => {
    res.status(201);
    res.send('User account created');
});

//Allow users to update their info
app.put('/users/:user', (req, res) => {
    res.send('User account updated');
});

//Allow users to add a movie to their favorites
app.post('/users/:user/favourites', (req, res) => {
    res.status(201);
    res.send('The movie has been add to favorites');
});

//Allow users to remove a movie from their favorites 
app.delete('/users/:user/favourites', (req, res) => {
    res.send('The movie has been removed from favorites');
});

//Allow existing users to deregister
app.delete('/users/:user', (req, res) => {
    res.send('You have been removed')
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