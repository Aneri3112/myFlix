const express = require('express'),
     morgan = require('morgan'),
     bodyParser = require('body-parser');
     uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./model.js'); 

const movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/[myFlixDB]', { useNewUrlParser: true, useUnifiedTopology: true });


let topmovies = [
    {
        title: 'Life Is Beautiful(1997)',
        description:'When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.',
        genre:  {
            Name:'Drama',
            description: 'The drama genre features stories with high stakes and a lot of conflicts. They are plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters',
        },
        director: {
            Name: 'Roberto Benigni',
            Bio:'Roberto Benigni was born in Manciano La Misericordia, Castiglion Fiorentino, Tuscany, Italy. He is an actor and writer, known for Life Is Beautiful, The Tiger and the Snow and Down by Law.',
            Birth:'1952-10-27',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BOWY1OWI1MmUtNjAxYy00MmRiLWI4YWItYjNjMmU4Yzc3M2QxXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UX100_CR0,0,100,100_AL_.jpg',
        Featured: true,
    },
    {
        title: 'Inception(2010)',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        genre:  {
            Name:'Sci-Fi',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
            Birth:'1970-07-30',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'The Dark Knight(2008)',
        description: 'A gang of criminals robs a Gotham City mob bank; the Joker manipulates them into murdering each other for a higher share until only he remains and escapes with the money. Batman, District Attorney Harvey Dent and Lieutenant Jim Gordon form an alliance to rid Gotham of organized crime.',
        genre:  {
            Name:'Action',
            description: 'Action films are a film genre where action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
            Birth:'1970-07-30',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'Joker',
        description: 'A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.',
        genre:  {
            Name:'Thriller',
            description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience.',
        },
        director: {
            Name: 'Todd Phillips',
            Bio:'Todd Phillips is an American filmmaker and actor who got his start by directing the comedy films Road Trip and Old School, the earlier inspired EuroTrip.',
            Birth:'1970-12-20',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: '3 Idiots',
        description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots".',
        genre:  {
            Name:'Comedy',
            description: 'Comedy Films are "make them laugh" films designed to elicit laughter from the audience. Comedies are light-hearted dramas, crafted to amuse, entertain, and provoke enjoyment.',
        },
        director: {
            Name: 'Rajkumar Hirani',
            Bio:'Rajkumar Hirani is an Indian filmmaker, director, producer and editor known for his works in Hindi films. He is the recipient of several accolades, including three National Film Awards and eleven Filmfare Awards.',
            Birth:'1962-11-20  ',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UY98_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'Jurassic Park',
        description: 'A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the parks cloned dinosaurs to run loose.',
        genre:  {
            Name:'Sci-Fi',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
            Name: 'Steven Spielberg',
            Bio:'Steven Allan Spielberg is an American film director, producer, and screenwriter. He began his career in the New Hollywood era and is currently the most commercially successful director of all time.',
            Birth:'1946-12-11',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'The Pursuit of Happyness',
        description: 'A struggling salesman takes custody of his son as he is poised to begin a life-changing professional career.',
        genre:  {
            Name:'Biography',
            description: '',
        },
        director: {
            Name: 'Gabriele Muccino',
            Bio:'Gabriele Muccino is an Italian film director. He has worked his way from making short films only aired on Italian television to become a well-known and successful American filmmake',
            Birth:'1967-05-20',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMTQ5NjQ0NDI3NF5BMl5BanBnXkFtZTcwNDI0MjEzMw@@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'In Time',
        description: 'In a future where people stop aging at 25, but are engineered to live only one more year, having the means to buy your way out of the situation is a shot at immortal youth. Here, Will Salas finds himself accused of murder and on the run with a hostage - a connection that becomes an important part of the way against the system.',
        genre:  {
            Name:'Sci-Fi',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
            Name: 'Andrew Niccol',
            Bio:'New Zealand-born screenwriter-director Andrew Niccol began his career in London, successfully directing TV commercials before moving to Los Angeles in order to make films "longer than 60 seconds.',
            Birth:'1964-06-10',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMjA3NzI1ODc1MV5BMl5BanBnXkFtZTcwMzI5NjQwNg@@._V1_UY98_CR1,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'Gandhi',
        description: 'The life of the lawyer who became the famed leader of the Indian revolts against the British rule through his philosophy of nonviolent protest.',
        genre:  {
            Name:'Biography',
            description: 'A (Biography) biopic is a movie that dramatizes the life of a real, non-fictional individual. Short for “biographical motion picture,” a biopic can cover a person’s entire life or one specific moment in their history',
        },
        director: {
            Name: 'Richard Attenborough',
            Bio:'Richard Attenborough was an English actor, filmmaker, and entrepreneur. He was the president of the Royal Academy of Dramatic Art (RADA) and the British Academy of Film and Television Arts (BAFTA), as well as the life president of Chelsea FC.',
            Birth:'1923-08-29',
            Death:'2014',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BMzJiZDRmOWUtYjE2MS00Mjc1LTg1ZDYtNTQxYWJkZTg1OTM4XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    },
    {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival',
        genre:  {
            Name:'Sci-Fi',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
            Name: 'Christopher Nolan',
            Bio:'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
            Birth:'1970-07-30',
            Death:'-',
        },
        Imagepath: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX67_CR0,0,67,98_AL_.jpg',
        Featured: true,
    }

];

app.get('/users', (req, res) => {
    Users.find()
    .then((user) => {
        res.status(201).json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    }); 
});


//CREATE
app.post('/users', (req, res) =>{
    Users.findOne({ Username: req.body.Username })
      .then((User) => {
        if(User){
  
        return res.status(400).send(req.body.Username + "  has been created ! ");
  
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((User) => {
            res.status(201).json(User);
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavouriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//DELETE
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
    {  $pull: { FavouriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//DELETE
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
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
    movies.find()
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
    movies.findOne({ title: req.params.Title })
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
    movies.findOne({ 'Genre.Name': req.params.Name}) 
    .then((movies) => {
        if(movies){ 
            res.status(200).json(movies.genre);
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
    movies.findOne({ 'director.Name': req.params.Name}) 
    .then((movies) => {
        if(movies) { 
            res.status(200).json(movies.director);
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