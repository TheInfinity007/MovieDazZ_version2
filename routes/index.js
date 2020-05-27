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

router.get("/*", (req, res)=>{
	errorCounter = 0;
	successCounter = 0;
	start = new Date().getTime();
	grabTrendingMovies(res);
	grabTheatreMovies(res);
	grabUpcomingMovies(res);
});

module.exports = router;