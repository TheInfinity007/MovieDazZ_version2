const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

//requiring routes
var indexRoute = require('./routes/index');
var movieRoute = require('./routes/movie');

var url = process.env.DATABASEURL || "mongodb://localhost/moviedazz";
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify:false});
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log("Connected to Mongoose"));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

/*PASSPORT CONFIGURATION*/
app.use(require('express-session')({
	secret: "Once again rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
});

app.use("/movie", movieRoute);
app.use('/', indexRoute);

app.listen(process.env.PORT || 3000, ()=>{
	console.log('MovieDazZ Has Started');
	console.log('Server is listening at localhost:3000');
});

