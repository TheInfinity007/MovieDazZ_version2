const express = require('express');
const router = express.Router();
const request = require('request');
const ExternalIds = require("../models/externalId");

var start;
var recommendations = [];

getImdbId = function(res, mId){
	let url = `https://api.themoviedb.org/3/movie/${mId}/external_ids?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let validId = false;
	let imdbId;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			imdbId = data['imdb_id'];
			validId = true;
			console.log(imdbId);
			ExternalIds.create({tmdbId: mId, imdbId: imdbId}, (err, obj)=>{
				console.log("New = " + obj);
			});
			grabMovieData(res, imdbId);
			if(validId){
				console.log("This is a valid Id");
			}
		}else{
			if(error)console.log("Error1 = ", error);
			if(response){console.log("Status Code1 = ", response.statusCode);}
			console.log("Unable to get the imdb id from tmdb id");
			res.redirect('back');
		}
	});
}

grabMovieData = function(res, imdbId){
	if(imdbId == null){
		console.log("IMDB ID IS NOT DEFINED FOR THIS MOVIE")
		return res.redirect('/');
	}
	url = `http://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=thewdb`;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			if(data.Response == 'True'){
				console.log(new Date().getTime()-start);
				res.render("show", {data: data, recommendations: recommendations});
			}else{
				console.log("Data Not Found Exit 2");
				res.redirect('back');
			}
		}else{
			if(error)console.log("Error = ", error);
			if(response){console.log("Status Code = ", response.statusCode);}
			console.log("ERROR OCCURED IN FETCHING THE DATA");
			res.redirect('back');
		}
	});
}

// FOR MOVIE CATEGORY
getMovies = function(res, url, pageTitle, pageUrl, pageNo){
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
			console.log(new Date().getTime() - start);
			res.render("movie", {
				data: movies, 
				pageTitle: pageTitle,
				pageUrl: pageUrl,
				current: pageNo,
				pages: data["total_pages"]
			});
		}else{
			if(error)console.log("Error = ", error);
			if(response){console.log("Status Code = ", response.statusCode);}
			console.log("ERROR OCCURED IN FETCHING THE DATA");
			res.redirect('back');
		}
	});
}


// MOVIE ROUTE
router.get('/in-theatre/*', (req, res)=>{
	start = new Date().getTime();
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	url = `https://api.themoviedb.org/3/movie/now_playing?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "In Theatre";
	let pageUrl = "in-theatre";
	getMovies(res, url, pageTitle, pageUrl, pageNo);
});

router.get('/evergreen/*', (req, res)=>{
	start = new Date().getTime();
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/top_rated?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Evergreen";
	let pageUrl = "evergreen";
	getMovies(res, url, pageTitle, pageUrl, pageNo);
});

router.get('/upcoming/*', (req, res)=>{
	start = new Date().getTime();
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/upcoming?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Upcoming";
	let pageUrl = "upcoming";
	getMovies(res, url, pageTitle, pageUrl, pageNo);
});

router.get('/trending/*', (req, res)=>{
	start = new Date().getTime();
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/trending/movie/day?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Trending";
	let pageUrl = "trending";
	getMovies(res, url, pageTitle, pageUrl, pageNo);
})

//FOR SEARCH PAGE
router.get('/i/:imdb_id/*', async(req, res)=>{
	try{
		let foundContent = await ExternalIds.findOne({imdbId: req.params.imdb_id});
		tmdbId = foundContent.tmdbId;
		console.log("Found = ", foundContent);
		if(tmdbId){
			console.log("Finding the recommendations");
			grabRecommendation(tmdbId);
		}
	}catch(err){	}
	grabMovieData(res, req.params.imdb_id);
});

grabRecommendation = function(id){
	recommendations  = [];
	let url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			for(i = 0; i < 10 ; i++){
				recommendations.push(data['results'][i]);
			}
		}
	});
}

// TO GET THE DETAILS ABOUT A MOVIE FROM HOME PAGE MOVIES CATEGORIES PAGE
router.get('/:movie_id/*', async (req, res)=>{
	console.log("Movie get Route");
	start = new Date().getTime();
	let movieId = req.params.movie_id.substr(0, req.params.movie_id.indexOf('-')) || req.params.movie_id;
	console.log(movieId);
	grabRecommendation(movieId);
	let imdbId;
	try{
		let foundContent = await ExternalIds.findOne({tmdbId: movieId}, {imdbId:1});
		imdbId = foundContent.imdbId;
		console.log("Found = ", foundContent);
	}catch(err){	}
	console.log("IMDBID = " + imdbId);
	if(imdbId === undefined){
		getImdbId(res, movieId);
	}else{
	 	 grabMovieData(res, imdbId)
	}
	console.log(movieId);
});

router.get('/*', (req, res)=>{
	start = new Date().getTime();
	let pageNo = 1;
	if(req.query.page){
		pageNo = parseInt(req.query.page);
	}
	let url = `https://api.themoviedb.org/3/movie/popular?page=${pageNo}&api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	let pageTitle = "Popular";
	let pageUrl = "";
	getMovies(res, url, pageTitle, pageUrl, pageNo);
});

module.exports = router;