const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy,
  Models = require('./model.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
        usernameField: 'Username',
        passwordField: 'Password'
    }, (username, password, callback) => {
            console.log(username + '  ' + password);
            
            Users.findOne({ Username: username }, (error, user) => {
                // Error handling
                if (error) {
                    console.log(error);
                    return callback(error);
                }
                // No user matches username
                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {message: 'Incorrect username or password.'});
                }
                    // Password wrong (use validatePassword to compare to hashed password stored in DB)
                if (!user.validatePassword(password)) {
                  console.log('incorrect password');
                  return callback(null, false, {message: 'Incorrect password.'});
                }
        // Username and password match - Execute callback
        console.log('finished');
        return callback(null, user);
    });
}));

// Strategy to authenticate users based on JWT
passport.use(new JWTStrategy({
    // Extract JWT from header of HTTP request
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    // Return the user by userID
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));