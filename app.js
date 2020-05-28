const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//requiring routes
var indexRoute = require('./routes/index');
var movieRoute = require('./routes/movie');

var url = process.env.DATABASEURL || "mongodb://localhost/moviedazz";
// var url = "mongodb+srv://infinity:infinity@cluster0-fyitp.mongodb.net/test?retryWrites=true&w=majority" || "mongodb://localhost/moviedazz";
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify:false});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use("/movie", movieRoute);
app.use('/', indexRoute);

app.listen(process.env.PORT || 3000, ()=>{
	console.log('MovieDazZ Has Started');
	console.log('Server is listening at localhost:3000');
});

