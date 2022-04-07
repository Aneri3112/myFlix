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
            Name:'Drama, Comedy, War',
            description: '',
        },
    },
    {
        title: 'Inception(2010)',
        director: 'Christopher Nolan',
        genre:  {
            Name:'Sci-Fi',
            description: '',
        },
    },
    {
        title: 'The Dark Knight(2008)',
        director: 'Christopher Nolan',
        genre:  {
            Name:'Action, Crime, Drama',
            description: '',
        },
    },
    {
        title: 'Joker',
        director: 'Todd Phillips',
        genre:  {
            Name:'Thriller, Crime',
            description: '',
        },
    },
    {
        title: '3 Idiots',
        director: 'Rajkumar Hirani',
        genre:  {
            Name:'Comedy, Drama',
            description: '',
        },
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg',
        genre:  {
            Name:'Sci-Fi, Adventure',
            description: '',
        },
    },
    {
        title: 'The Pursuit of Happyness',
        director: 'Gabriele Muccino',
        genre:  {
            Name:'Biography',
            description: '',
        },
    },
    {
        title: 'In Time',
        director: 'Andrew Niccol',
        genre:  {
            Name:'Sci-Fi',
            description: '',
        },
    },
    {
        title: 'Gandhi',
        director: 'Richard Attenborough',
        genre:  {
            Name:'Biography',
            description: '',
        },
    },
    {
        title: 'Interstellar',
        director: 'Christopher Nolan',
        genre:  {
            Name:'Sci-Fi',
            description: '',
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
    const Genre = topmovies.find(movie => movie.genre.Name === genreName ).genre;

    if (Genre) {
        res.status(200).json(Genre);
    } else
        res.status(400).send('no such genre')
});

//Return data about a director
app.get('/movies/:director', (req, res) => {
    const { director } = req.params;
    const movie = topmovies.find(movie => movie.director === director );

    if (movie) {
        res.status(200).json(movie);
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