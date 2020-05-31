const express = require("express");
const router = express.Router();
const request = require('request');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');


var start;
var successCounter = 0;
var  errorCounter= 0;
var trendingMovies = [];
var theatreMovies = [];
var upcomingMovies = [];

checkMovies = function(res){
	if(trendingMovies.length > 0 && theatreMovies.length > 0 && upcomingMovies.length > 0){
		console.log(new  Date().getTime() - start);
		res.render("index", {trendingMovies: trendingMovies, theatreMovies: theatreMovies, upcomingMovies: upcomingMovies});
	}else if(errorCounter > 0){
		res.send("Error Occured in Getting The movies");
	}
}

grabTrendingMovies = function(res){
	if(trendingMovies.length < 1){
		url = "https://api.themoviedb.org/3/trending/movie/day?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
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
				console.log("Grab1");
				checkMovies(res);
			}else{
				console.log("Exit 1");
				grabTrendingMovies(res);
			}
		});
	}
}

grabTheatreMovies = function(res){
	if(theatreMovies.length < 1){
		let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
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
				console.log("Grab2");
				checkMovies(res);
			}else{
				console.log("Exit 2");
				grabTheatreMovies(res);
			}
		});
	}
}

grabUpcomingMovies = function(res){
	if(upcomingMovies.length < 1){
		let url = "https://api.themoviedb.org/3/movie/upcoming?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
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
				console.log("Grab3");
				checkMovies(res);
			}else{
				console.log("Exit 3");
				grabUpcomingMovies(res);
			}
		});
	}
}

router.get('/search/:type/:title/:pageNo/*', (req, res)=>{
	let url = `http://www.omdbapi.com/?s=${req.params.title}&page=${req.params.pageNo}&type=movie&apikey=thewdb`;
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render("result", {
				data: data,
				search: req.params.title,
				current: req.params.pageNo,
				pages: Math.ceil(data["totalResults"]/10)
			});
		}
	})
});


// Signup Route
router.get('/register/*', (req, res)=>{
	res.render("register");
});

// Handle Signup Logic
router.post('/register', (req, res)=>{
	console.log(req.body);
	let password = req.body.password;
	let newUser = new User({
		username: req.body.username
	});
	User.register(newUser, password, (err, user)=>{
		if(err){
			console.log(err);
			res.redirect("/");
		}else{
			console.log(user);
			passport.authenticate("local")(req, res, ()=>{
				console.log("User has been Created");
				res.redirect("/");
			});
		}
	});
});

// Login Route
router.get('/login/*', (req, res)=>{
	res.render("login");
});

// Handle Login Logic
router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login/'
	}), (req, res)=>{
	console.log("Loggin the user");
})

// Logout Route
router.get('/logout/*', (req, res)=>{
	req.logout();
	console.log("Logout the User");
	res.redirect('/');
});

router.get('/favourite/:imdbId/', middleware.isLoggedIn, (req, res)=>{
	User.findById(req.user._id, (err, user)=>{
		if(err){
			console.log("Error Occured in Adding the items to favourites");
			console.log(err);
			return res.redirect('/');
		}
		user.favouriteMovieList.push(req.params.imdbId);
		user.save();
		console.log("Added item to favourites");
		res.redirect('back');
	});
});

router.get('/watchlist/:imdbId/', middleware.isLoggedIn, (req, res)=>{
	User.findById(req.user._id, (err, user)=>{
		if(err){
			console.log(err);
			return res.redirect('/');
		}
		user.watchList.push(req.params.imdbId);
		user.save();
		console.log("Added item to watchlist");
		res.redirect('back');
	});
});


router.get("/*", (req, res)=>{
	trendingMovies = [];
	theatreMovies = [];
	upcomingMovies = [];
	start = new Date().getTime();
	grabTrendingMovies(res);
	grabTheatreMovies(res);
	grabUpcomingMovies(res);
});

module.exports = router;