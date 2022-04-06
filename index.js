const express = require('express'),
     morgan = require('morgan'),
     bodyParser = require('body-parser');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

let topmovies = [
    {
        title: 'Life Is Beautiful(1997)',
        director: 'Roberto Benigni'
    },
    {
        title: 'Inception(2010)',
        director: 'Christopher Nolan'
    },
    {
        title: 'The Dark Knight(2008)',
        director: 'Christopher Nolan'
    },
    {
        title: 'Joker',
        director: 'Todd Phillips'
    },
    {
        title: '3 Idiots',
        director: 'Rajkumar Hirani'
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg'
    },
    {
        title: 'The Pursuit of Happyness',
        director: 'Gabriele Muccino'
    },
    {
        title: 'In Time',
        director: 'Andrew Niccol'
    },
    {
        title: 'Gandhi',
        director: 'Richard Attenborough'
    },
    {
        title: 'Interstellar',
        director: 'Christopher Nolan'
    }

];

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  app.get('/movies', (req, res) => {
    res.json(topmovies);
  });

// morgan logs requests
app.get('/', (req, res) => {
    res.send('Welcome to my app!');
  });
  
  app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
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