var express = require("express");
var router = express.Router();
const request = require('request');

var start;
var successCounter = 0;
var  errorCounter= 0;
var trendingMovies = [];
var theatreMovies = [];
var upcomingMovies = [];

checkMovies = function(res){
	if(successCounter == 3){
		console.log(new  Date().getTime() - start);
		res.render("index", {trendingMovies: trendingMovies, theatreMovies: theatreMovies, upcomingMovies: upcomingMovies});
	}else if(errorCounter > 0){
		res.send("Error Occured in Getting The movies");
	}
}

grabTrendingMovies = function(res){
	url = "https://api.themoviedb.org/3/trending/movie/day?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
	if(errorCounter == 0){
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				let data = JSON.parse(body);
				data["results"].forEach((result)=>{
					if(result["poster_path"] === null) return;
					let temp = [];
					temp.push(result["id"]);
					temp.push(result["vote_average"]);
					temp.push(result["title"]);
					temp.push(result["release_date"]);
					temp.push(result["poster_path"]);
					trendingMovies.push(temp);
				});
				successCounter++;
				console.log("Grab1");
				checkMovies(res);
			}else{
				errorCounter++;
				console.log("Exit 1");
			}
		});
	}else if(errorCounter == 1){
		res.redirect("/");
		errorCounter++;
	}
}

grabTheatreMovies = function(res){
	let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
	if(errorCounter == 0){
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				let data = JSON.parse(body);
				data["results"].forEach((result)=>{
					if(result["poster_path"] === null) return;
					let temp = [];
					temp.push(result["id"]);
					temp.push(result["vote_average"]);
					temp.push(result["title"]);
					temp.push(result["release_date"]);
					temp.push(result["poster_path"]);
					theatreMovies.push(temp);
				});
				successCounter++;
				console.log("Grab2");
				checkMovies(res);
			}else{
				errorCounter++;
				console.log("Exit 2");
			}
		});
	}else if(errorCounter == 1){
		res.redirect("/");
		errorCounter++;
	}
}

grabUpcomingMovies = function(res){
	let url = "https://api.themoviedb.org/3/movie/upcoming?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
	if(errorCounter == 0){
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				let data = JSON.parse(body);
				data["results"].forEach((result)=>{
					if(result["poster_path"] === null) return;
					let temp = [];
					temp.push(result["id"]);
					temp.push(result["vote_average"]);
					temp.push(result["title"]);
					temp.push(result["release_date"]);
					temp.push(result["poster_path"]);
					upcomingMovies.push(temp);
				});
				successCounter++;
				console.log("Grab3");
				checkMovies(res);
			}else{
				errorCounter++;
				console.log("Exit 3");
			}
		});
	}else if(errorCounter == 1){
		res.redirect("/");
		errorCounter++;
	}
}

router.get('/search/:title/:pageNo/*', (req, res)=>{
	let url = `http://www.omdbapi.com/?s=${req.params.title}&page=${req.params.pageNo}&apikey=thewdb`;
	res.send("Welcome to search results");
});


router.get("/search", (req, res)=>{
	if(req.query.s || req.query.t || req.query.i){
		let query = req.query;
		let pageQuery = parseInt(req.query.page);
		let searchQuery = req.query.t || req.query.i || req.query.s;
		let searchQueryType = req.query.t?"t" :  (req.query.i ?"i" : "s");
		let yearQuery = req.query.y;

		var pageNo = pageQuery ? pageQuery : 1;

		// console.log(query);
		let url;
		if(searchQueryType === "i" || searchQueryType === "t"){
			url = "http://www.omdbapi.com/?" + req._parsedUrl.query + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
		}else{
			var search = searchQueryType + "=" + searchQuery + "&y=" + yearQuery;
			url = "http://www.omdbapi.com/?" + search + "&page=" + pageNo + "&apikey=" + process.env.OMDB_API_KEY;
		}
		// console.log(url);
		let msg = "";
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				var data = JSON.parse(body);
				// console.log(response.statusCode);
				if((query.t || query.i) && data.Response == "True"){
					res.render("show", {data : data});
				}else if(data.Response == "True"){
					res.render("results", {
						data : data,
						search : search,
						current: pageNo,
						pages: Math.ceil(data['totalResults']/10),
					});
				}else{
					console.log(data);
					if(data.Error == "Too many results."){
						msg = data.Error + " Please type a meaningful word.";
						return res.render("search", {msg : msg});
					}
					res.redirect("back");
				}
			}else{
				console.log(error);
				// msg = "Error Occured! Please Try again";
				res.redirect("back");
			}
		});
	}else{
		res.redirect("/");
	}
});


router.get("/*", (req, res)=>{
	errorCounter = 0;
	successCounter = 0;
	start = new Date().getTime();
	grabTrendingMovies(res);
	grabTheatreMovies(res);
	grabUpcomingMovies(res);
});

module.exports = router;