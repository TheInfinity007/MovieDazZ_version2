const express = require('express');
const request = require('request');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ExternalIds = require("./models/externalId");

//requiring routes
var indexRoute = require('./routes/index');
var movieRoute = require('./routes/movie');

var url = "mongodb://localhost/moviedazz";
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify:false});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', indexRoute);
app.use("/movie", movieRoute);



app.listen(process.env.PORT || 3000, ()=>{
	console.log('MovieDazZ Has Started');
	console.log('Server is listening at localhost:3000');
});

