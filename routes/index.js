const express = require("express");
const router = express.Router();
const request = require('request');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const Movie = require('../models/movie');
const ExternalIds = require("../models/externalId");


var start;
var trendingMovies = [];
var theatreMovies = [];
var upcomingMovies = [];
var isRender = false;

checkMovies = function(res){
	if(isRender == false){
		if(trendingMovies.length > 0 && theatreMovies.length > 0 && upcomingMovies.length > 0){
			console.log(new  Date().getTime() - start);
			isRender = true;
			res.render("index", {trendingMovies: trendingMovies, theatreMovies: theatreMovies, upcomingMovies: upcomingMovies});
		}
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

isNumber = function(num){
	if(!parseInt(num)){
        return false;		//This is a string
    }else{
        return true;		//This is a Number
    }
}

getImdb = function(req, id, title, img, rel){
	let url = `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			imdbId = data['imdb_id'];
			addToFavouriteMovie(imdbId, title, img, rel);
			User.findById(req.user._id, (err, user)=>{
				if(err){
					console.log(err);
				}else{
					user.favouriteMovieList.push(imdbId);
					user.save();
				}
			});
		}
	});
}


addToFavouriteMovie = function(id, title, img, rel){
	let newMovie = new Movie({
		imdbId: id,
		title:title,
		imgUrl: img,
		release: rel
	});
	Movie.create(newMovie, (err, movie)=>{
		if(err){
			console.log(err);
			console.log("Movie already Exist.")
		}else{
			console.log("Add a New Movie");
		}
	});
}

getTmdb = function(req, id){
	let url = `https://api.themoviedb.org/3/find/${id}?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9&external_source=imdb_id`;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);

			if(data["movie_results"].length > 0){
				let tmdbId = data["movie_results"][0]["id"];
				console.log("TMDB ID IS ", tmdbId);

				User.findById(req.user._id, (err, user)=>{
					if(err){
						console.log(err);
					}else{
						user.favouriteMovieList.push(tmdbId);
						user.save();
					}
				});
			}
		}
	});	
}

router.get('/favourite/*', middleware.isLoggedIn, (req, res)=>{
	User.findById(req.user._id, (err, user)=>{
		let myFav = user.favouriteMovieList.filter((id)=>{
			return id[0] == 't';
		});
		let movies = [];
		if(myFav.length == 0)
			res.render("favourite", {movies: null, pageTitle: "Favourites"});
		myFav.forEach((mId, i)=>{
			Movie.findOne({imdbId: mId}, (err, movie)=>{
				movies.push(movie);
				if(i == myFav.length-1){
					res.render("favourite", {movies: movies, pageTitle: "Favourites"});
				}
			});
		});
	});
});

//  NEW ROUTE FOR FAVOURITE
router.post('/favourite', middleware.isLoggedIn, (req, res)=>{
	let imdbId = req.body.id;
	let title = req.body.title;
	let release = req.body.release;
	let img = req.body.img;
	
	User.findById(req.user._id, (err, user)=>{
		if(err){
			console.log("Error Occured in Adding the items to favourites");
			console.log(err);
			return res.redirect('/');
		}
		let newMovie = user.favouriteMovieList.every((movieId)=>{
			return movieId != imdbId;
		});
		console.log(newMovie);
		if(newMovie){
			if(isNumber(imdbId)){			//if the id is the tmdb id
				getImdb(req, imdbId, title, img, release);
			}else{
				getTmdb(req, imdbId);
				addToFavouriteMovie(imdbId, title, img, release);
			}

			if(imdbId != null) user.favouriteMovieList.push(imdbId);
			user.save();
			console.log("Added item to favourites");
		}else{
			console.log("Movie already Exist in favourites");
		}
		res.redirect("back");
	});
});

//  DELETE ROUTE FOR FAVOURITES
router.delete('/favourite/:imdbId', middleware.isLoggedIn, (req, res)=>{
	let id = req.params.imdbId;
	let tmdbid;
	let imdbid;
	User.findById(req.user._id, async(err, user)=>{
		if(err){
			console.log("Error occurred in fetching the user");
			res.redirect('/');
		}else{
			if(isNumber(id)){		//if the id is the tmdb id
				try{
					tmdbid = id;
					let foundContent = await ExternalIds.findOne({tmdbId: id});
					imdbid = foundContent.imdbId;
				}catch(err){}
			}else{							//if id is imdb id
				try{
					imdbid = id;
					let foundContent = await ExternalIds.findOne({imdbId: id});
					tmdbid = foundContent.tmdbId;
				}catch(err){}
			}
			console.log(imdbid, tmdbid);
			let i = -1, t = -1;
			user.favouriteMovieList.forEach((id, index)=>{
				if(id == tmdbid)
					t = index;
				if(id == imdbid)
					i = index;
			});
			if(i > t){
				if(i != -1) user.favouriteMovieList.splice(i, 1);
				if(t != -1) user.favouriteMovieList.splice(t, 1);
			}else{
				if(t != -1) user.favouriteMovieList.splice(t, 1);
				if(i != -1) user.favouriteMovieList.splice(i, 1);
			}
			console.log("Movie removed from favourites");
			user.save();
			res.redirect('back');
		}
	});
});

getImdbWatchList = function(req, id, title, img, rel){
	let url = `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			imdbId = data['imdb_id'];
			addToFavouriteMovie(imdbId, title, img, rel);
			User.findById(req.user._id, (err, user)=>{
				if(err){
					console.log(err);
				}else{
					user.watchList.push(imdbId);
					user.save();
				}
			});
		}
	});
}

getTmdbWatchList = function(req, id){
	let url = `https://api.themoviedb.org/3/find/${id}?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9&external_source=imdb_id`;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);

			if(data["movie_results"].length > 0){
				let tmdbId = data["movie_results"][0]["id"];
				console.log("TMDB ID IS ", tmdbId);

				User.findById(req.user._id, (err, user)=>{
					if(err){
						console.log(err);
					}else{
						user.watchList.push(tmdbId);
						user.save();
					}
				});	
			}
		}
	});	
}

router.get('/watchlist/*', middleware.isLoggedIn, (req, res)=>{
	User.findById(req.user._id, (err, user)=>{
		let myList = user.watchList.filter((id)=>{
			return id[0] == 't';
		});
		let movies = [];
		if(myList.length == 0)
			res.render("favourite", {movies: null, pageTitle: "Watchlist"});
		myList.forEach((mId, i)=>{
			Movie.findOne({imdbId: mId}, (err, movie)=>{
				movies.push(movie);
				if(i == myList.length-1){
					res.render("favourite", {movies: movies, pageTitle: "Watchlist"});
				}
			});
		});
	});
});

//  NEW ROUTE FOR WATCHLIST
router.post('/watchlist', middleware.isLoggedIn, (req, res)=>{
	let imdbId = req.body.id;
	let title = req.body.title;
	let release = req.body.release;
	let img = req.body.img;
	
	User.findById(req.user._id, (err, user)=>{
		if(err){
			console.log("Error Occured in Adding the items to watchlist");
			console.log(err);
			return res.redirect('/');
		}
		let newMovie = user.watchList.every((movieId)=>{
			return movieId != imdbId;
		});
		console.log(newMovie);
		if(newMovie){
			if(isNumber(imdbId)){			//if the id is the tmdb id
				getImdbWatchList(req, imdbId, title, img, release);
			}else{
				getTmdbWatchList(req, imdbId);
				addToFavouriteMovie(imdbId, title, img, release);
			}

			if(imdbId != null) user.watchList.push(imdbId);
			user.save();
			console.log("Added item to watchlist");
		}else{
			console.log("Movie already Exist in watchlist");
		}
	});
	res.redirect("back");
});

//  DELETE ROUTE FOR WATCHLIST
router.delete('/watchlist/:imdbId', middleware.isLoggedIn, (req, res)=>{
	User.findById(req.user._id, async (err, user)=>{
		if(err){
			console.log("Error occurred in fetching the user");
			res.redirect("/");
		}else{
			let tmdbid;
			let imdbid = req.params.imdbId;
			try{
				let foundContent = await ExternalIds.findOne({imdbId: req.params.imdbId});
				tmdbid = foundContent.tmdbId;
			}catch(err){	}
			let i = -1, t = -1;
			user.watchList.forEach((id, index)=>{
				if(id == tmdbid)
					t = index;
				if(id == imdbid)
					i = index;
			});

			if(i > t){						//higher index movie id should be removed first
				if(i != -1) user.watchList.splice(i, 1);
				if(t != -1) user.watchList.splice(t, 1);
			}else{
				if(t != -1) user.watchList.splice(t, 1);
				if(i != -1) user.watchList.splice(i, 1);
			}
			console.log("Movie removed from watchlist");
			user.save();
			res.redirect('back');
		}
	});
});

router.get("/download/:imdbId/", (req, res)=>{
	let url = `https://yts.mx/api/v2/list_movies.json?query_term=${req.params.imdbId}`;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			if(data['data']['movie_count'] != 0){
				data = data['data']['movies'][0];
				let img = data['small_cover_image'];
				let title = data['title'];
				console.log(data['torrents']);
				res.render('download', {img: img, data: data['torrents'], title: title});
				// return res.send(data);
			}
			else
				return res.send("DATA NOT FOUND");
		}
	});
	// res.render('download');
})

router.get("/*", (req, res)=>{
	isRender = false;
	trendingMovies = [];
	theatreMovies = [];
	upcomingMovies = [];
	start = new Date().getTime();
	grabTrendingMovies(res);
	grabTheatreMovies(res);
	grabUpcomingMovies(res);
});

module.exports = router;