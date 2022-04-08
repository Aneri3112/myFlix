const express = require('express'),
     morgan = require('morgan'),
     bodyParser = require('body-parser');
     uuid = require('uuid');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Anna",
        favouriteMovies: []
    },
    {
        id: 2,
        name: "Frank",
        favouriteMovies: ["Joker"]
    }
]

let topmovies = [
    {
        title: 'Life Is Beautiful(1997)',
        genre:  {
            Name:'Drama, Comedy, War',
            description: '',
        },
        director: {
            Name: 'Roberto Benigni',
            Bio:'',
            Birth:'1952',
            Death:'-',
        },
    },
    {
        title: 'Inception(2010)',
        genre:  {
            Name:'Sci-Fi',
            description: '',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'',
            Birth:'1970',
            Death:'-',
        },
    },
    {
        title: 'The Dark Knight(2008)',
        genre:  {
            Name:'Action, Crime, Drama',
            description: '',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'',
            Birth:'1970',
            Death:'-',
        },
    },
    {
        title: 'Joker',
        director: 'Todd Phillips',
        genre:  {
            Name:'Thriller, Crime',
            description: '',
        },
        director: {
            Name: 'Todd Phillips',
            Bio:'',
            Birth:'1970',
            Death:'-',
        },
    },
    {
        title: '3 Idiots',
        genre:  {
            Name:'Comedy, Drama',
            description: '',
        },
        director: {
            Name: 'Rajkumar Hirani',
            Bio:'',
            Birth:'1962',
            Death:'-',
        },
    },
    {
        title: 'Jurassic Park',
        genre:  {
            Name:'Sci-Fi, Adventure',
            description: '',
        },
        director: {
            Name: 'Steven Spielberg',
            Bio:'',
            Birth:'1946',
            Death:'-',
        },
    },
    {
        title: 'The Pursuit of Happyness',
        genre:  {
            Name:'Biography',
            description: '',
        },
        director: {
            Name: 'Gabriele Muccino',
            Bio:'',
            Birth:'1967',
            Death:'-',
        },
    },
    {
        title: 'In Time',
        genre:  {
            Name:'Sci-Fi',
            description: '',
        },
        director: {
            Name: 'Andrew Niccol',
            Bio:'',
            Birth:'1964',
            Death:'-',
        },
    },
    {
        title: 'Gandhi',
        genre:  {
            Name:'Biography',
            description: '',
        },
        director: {
            Name: 'Richard Attenborough',
            Bio:'',
            Birth:'1923',
            Death:'2014',
        },
    },
    {
        title: 'Interstellar',
        genre:  {
            Name:'Sci-Fi',
            description: '',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'',
            Birth:'1970',
            Death:'-',
        }
    }

];

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else 
        res.status(400).send('users need name')
})

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else 
        res.status(400).send('no such user')
})

//CREATE
app.post('/users/:id/:movietitle', (req, res) => {
    const { id, movietitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favouriteMovies.push(movietitle);
        res.status(200).send(`${movieName} has been added to user ${id}'s array`);
    } else 
        res.status(400).send('no such user')
})

//Read
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
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const Director = topmovies.find(movie => movie.director.Name === directorName ).director;

    if (Director) {
        res.status(200).json(Director);
    } else 
        res.status(400).send('no such director')  
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