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




var externalIdsData = {};
var start;

var myTrendingMovies = [];
var theatreMovies = [];
var upcomingMovies = [];

getImdbId = function(res, mId){
	let url = `https://api.themoviedb.org/3/movie/${mId}/external_ids?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			let imdbId = data['imdb_id'];
			console.log(imdbId);
			ExternalIds.create({tmdbId: mId, imdbId: imdbId}, (err, obj)=>{
				console.log("New = " + obj);
			})
			externalIdsData[mId] = imdbId;
			grabMovieData(res, imdbId);
		}else{
			res.send("ERROR OCCURED");
		}
	});
}

grabMovieData = function(res, imdbId){
	url = `http://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=thewdb`;
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			console.log(new Date().getTime()-start);
			console.log(data);
			res.render("show", {data: data});
		}else{
			res.send("ERROR OCCURED IN FETCHING THE DATA");
		}
	});
}





getMovies = function(url, pageTitle, pageUrl, pageNo, res){
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			let movies = [];
			data["results"].forEach((result)=>{
				if(result["poster_path"] === null) return;
				let temp = [];
				temp.push(result["id"]);
				temp.push(result["vote_average"]);
				temp.push(result["title"]);
				temp.push(result["release_date"]);
				temp.push(result["poster_path"]);
				movies.push(temp);
			});
			res.render("movie", {
				data: movies, 
				pageTitle: pageTitle,
				pageUrl: pageUrl,
				current: pageNo,
				pages: data["total_pages"]
			});
		}else{
			res.send("ERROR OCCURED IN FETCHING THE DATA");
		}
	});
}

app.get('/movie', (req, res)=>{
	let popularMovies = [];
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/popular?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Popular";
	let pageUrl = "";
	getMovies(url, pageTitle, pageUrl, pageNo, res);
});

app.get('/movie/in-theatre', (req, res)=>{
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	url = `https://api.themoviedb.org/3/movie/now_playing?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "In Theatre";
	let pageUrl = "in-theatre";
	getMovies(url, pageTitle, pageUrl, pageNo, res);
});

app.get('/movie/evergreen', (req, res)=>{
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/top_rated?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Evergreen";
	let pageUrl = "evergreen";
	getMovies(url, pageTitle, pageUrl, pageNo, res);
});

app.get('/movie/upcoming', (req, res)=>{
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/upcoming?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Upcoming";
	let pageUrl = "upcoming";
	getMovies(url, pageTitle, pageUrl, pageNo, res);
});

app.get('/movie/:movie_id', async (req, res)=>{
	start = new Date().getTime();
	let movieId = req.params.movie_id.substr(0, req.params.movie_id.indexOf('-'));
	let imdbId;
	try{
		foundContent = await ExternalIds.findOne({tmdbId: movieId}, {imdbId:1});
		imdbId = foundContent.imdbId;
		console.log("Found = ", foundContent);
	}catch(err){	}
	
	if(imdbId === undefined){
		getImdbId(res, movieId);
	}else{
	 	 grabMovieData(res, imdbId)
	}
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log('MovieDazZ Has Started');
	console.log('Server is listening at localhost:3000');
});

