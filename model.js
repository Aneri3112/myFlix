const mongoose = require('mongoose');

let movieSchema = mongoose.Schema ({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        Name: String,
        description: String
    },
    director: {
        Name: String,
        Bio: String,
        Birth: Date,
        Death: Date
    },
    Imagepath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema ({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;