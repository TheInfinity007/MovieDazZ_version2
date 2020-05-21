const express = require('express');
const request = require('request');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var ExternalIds = require("./models/externalId");

var url = "mongodb://localhost/moviedazz";
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify:false});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var externalIdsData = {};
var start;

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
	// res.render("show", {data: movieDetails});
}

// app.get("/", (req, res)=>{
// 	let myTrendingMovies = [];
// 	let theatreMovies = [];
// 	let upcomingMovies = [];
// 	let url = "https://api.themoviedb.org/3/trending/movie/week?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
// 	request(url, (error, response, body)=>{
// 		let data = JSON.parse(body);
// 		console.log(data["results"].length);
// 		data["results"].forEach((result)=>{
// 			if(result["poster_path"] === null) return;
// 			let temp = [];
// 			temp.push(result["id"]);
// 			temp.push(result["vote_average"]);
// 			temp.push(result["title"]);
// 			temp.push(result["release_date"]);
// 			temp.push(result["poster_path"]);
// 			myTrendingMovies.push(temp);
// 		});
// 		url = "https://api.themoviedb.org/3/movie/now_playing?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
// 		request(url, (error, response, body)=>{
// 			data = JSON.parse(body);
// 			console.log(data["results"].length);
// 			data["results"].forEach((result)=>{
// 				if(result["poster_path"] === null) return;
// 				let temp = [];
// 				temp.push(result["id"]);
// 				temp.push(result["vote_average"]);
// 				temp.push(result["title"]);
// 				temp.push(result["release_date"]);
// 				temp.push(result["poster_path"]);
// 				theatreMovies.push(temp);
// 			});
// 			url = "https://api.themoviedb.org/3/movie/now_playing?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
// 			request(url, (error, response, body)=>{
// 				data = JSON.parse(body);
// 				console.log(data["results"].length);
// 				data["results"].forEach((result)=>{
// 					if(result["poster_path"] === null) return;
// 					let temp = [];
// 					temp.push(result["id"]);
// 					temp.push(result["vote_average"]);
// 					temp.push(result["title"]);
// 					temp.push(result["release_date"]);
// 					temp.push(result["poster_path"]);
// 					upcomingMovies.push(temp);
// 				});
// 				res.render("index", {trendingMovies: myTrendingMovies, theatreMovies: theatreMovies, upcomingMovies: upcomingMovies});
// 			});
// 		});
// 	});
// });	

app.get("/", (req, res)=>{
	let myTrendingMovies = [];
	let theatreMovies = [];
	let upcomingMovies = [];
	let data = trendingMovies;
	console.log(data["results"].length);
	data["results"].forEach((result)=>{
		let temp = [];
		temp.push(result["id"]);
		temp.push(result["vote_average"]);
		temp.push(result["title"]);
		temp.push(result["release_date"]);
		temp.push(result["poster_path"]);
		myTrendingMovies.push(temp);
	});
	data = nowPlaying;
	data["results"].forEach((result)=>{
		let temp = [];
		temp.push(result["id"]);
		temp.push(result["vote_average"]);
		temp.push(result["title"]);
		temp.push(result["release_date"]);
		temp.push(result["poster_path"]);
		theatreMovies.push(temp);
	});
	data = upcoming;
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
	res.render("index", {trendingMovies: myTrendingMovies, theatreMovies: theatreMovies, upcomingMovies: upcomingMovies});
});

app.get('/movie', (req, res)=>{
	let popularMovies = [];
	data = popularMovie;
	data["results"].forEach((result)=>{
		if(result["poster_path"] === null) return;
		let temp = [];
		temp.push(result["id"]);
		temp.push(result["vote_average"]);
		temp.push(result["title"]);
		temp.push(result["release_date"]);
		temp.push(result["poster_path"]);
		popularMovies.push(temp);
	});

	// url = `https://api.themoviedb.org/3/movie/popular?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9`;
	// request(url, (error, response, body)=>{
	// 	if(!error && response.statusCode == 200){
	// 		let data = JSON.parse(body);
	// 		console.log(data);
	// 		res.render("movie", {data: data});
	// 	}else{
	// 		res.send("ERROR OCCURED IN FETCHING THE DATA");
	// 	}
	// });
	res.render("movie", {data: popularMovies});
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
	
	console.log(imdbId);
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


var popularMovie = {
"page": 1,
"total_results": 10000,
"total_pages": 500,
"results": [
{
"popularity": 507.351,
"vote_count": 3427,
"video": false,
"poster_path": "/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
"id": 419704,
"adult": false,
"backdrop_path": "/5BwqwxMEjeFtdknRV792Svo0K1v.jpg",
"original_language": "en",
"original_title": "Ad Astra",
"genre_ids": [
18,
878
],
"title": "Ad Astra",
"vote_average": 6,
"overview": "The near future, a time when both hope and hardships drive humanity to look to the stars and beyond. While a mysterious phenomenon menaces to destroy life on planet Earth, astronaut Roy McBride undertakes a mission across the immensity of space and its many perils to uncover the truth about a lost expedition that decades before boldly faced emptiness and silence in search of the unknown.",
"release_date": "2019-09-17"
},
{
"popularity": 258.564,
"vote_count": 513,
"video": false,
"poster_path": "/zG2l9Svw4PTldWJAzC171Y3d6G8.jpg",
"id": 385103,
"adult": false,
"backdrop_path": "/b5Fej0UT6gPFd2GcGEWw4SAwGUM.jpg",
"original_language": "en",
"original_title": "Scoob!",
"genre_ids": [
12,
16,
35,
9648,
10751
],
"title": "Scoob!",
"vote_average": 8.1,
"overview": "In Scooby-Doo’s greatest adventure yet, see the never-before told story of how lifelong friends Scooby and Shaggy first met and how they joined forces with young detectives Fred, Velma, and Daphne to form the famous Mystery Inc. Now, with hundreds of cases solved, Scooby and the gang face their biggest, toughest mystery ever: an evil plot to unleash the ghost dog Cerberus upon the world. As they race to stop this global “dogpocalypse,” the gang discovers that Scooby has a secret legacy and an epic destiny greater than anyone ever imagined.",
"release_date": "2020-05-15"
},
{
"popularity": 160,
"vote_count": 2324,
"video": false,
"poster_path": "/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg",
"id": 338762,
"adult": false,
"backdrop_path": "/ocUrMYbdjknu2TwzMHKT9PBBQRw.jpg",
"original_language": "en",
"original_title": "Bloodshot",
"genre_ids": [
28,
18,
878
],
"title": "Bloodshot",
"vote_average": 7.1,
"overview": "After he and his wife are murdered, marine Ray Garrison is resurrected by a team of scientists. Enhanced with nanotechnology, he becomes a superhuman, biotech killing machine—'Bloodshot'. As Ray first trains with fellow super-soldiers, he cannot recall anything from his former life. But when his memories flood back and he remembers the man that killed both him and his wife, he breaks out of the facility to get revenge, only to discover that there's more to the conspiracy than he thought.",
"release_date": "2020-03-05"
},
{
"popularity": 114.479,
"vote_count": 2037,
"video": false,
"poster_path": "/wlfDxbGEsW58vGhFljKkcR5IxDj.jpg",
"id": 545609,
"adult": false,
"backdrop_path": "/1R6cvRtZgsYCkh8UFuWFN33xBP4.jpg",
"original_language": "en",
"original_title": "Extraction",
"genre_ids": [
28,
18,
53
],
"title": "Extraction",
"vote_average": 7.5,
"overview": "Tyler Rake, a fearless mercenary who offers his services on the black market, embarks on a dangerous mission when he is hired to rescue the kidnapped son of a Mumbai crime lord…",
"release_date": "2020-04-24"
},
{
"popularity": 113.276,
"vote_count": 3959,
"video": false,
"poster_path": "/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg",
"id": 495764,
"adult": false,
"backdrop_path": "/kvbbK2rLGSJh9rf6gg1i1iVLYQS.jpg",
"original_language": "en",
"original_title": "Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)",
"genre_ids": [
28,
35,
80
],
"title": "Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)",
"vote_average": 7.2,
"overview": "Harley Quinn joins forces with a singer, an assassin and a police detective to help a young girl who had a hit placed on her after she stole a rare diamond from a crime lord.",
"release_date": "2020-02-05"
},
{
"popularity": 107.574,
"vote_count": 4038,
"video": false,
"poster_path": "/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg",
"id": 454626,
"adult": false,
"backdrop_path": "/stmYfCUGd8Iy6kAMBr6AmWqx8Bq.jpg",
"original_language": "en",
"original_title": "Sonic the Hedgehog",
"genre_ids": [
28,
35,
878,
10751
],
"title": "Sonic the Hedgehog",
"vote_average": 7.5,
"overview": "Based on the global blockbuster videogame franchise from Sega, Sonic the Hedgehog tells the story of the world’s speediest hedgehog as he embraces his new home on Earth. In this live-action adventure comedy, Sonic and his new best friend team up to defend the planet from the evil genius Dr. Robotnik and his plans for world domination.",
"release_date": "2020-02-12"
},
{
"popularity": 107.286,
"vote_count": 218,
"video": false,
"poster_path": "/A2YlIrzypvhS3vTFMcDkG3xLvac.jpg",
"id": 582596,
"adult": false,
"backdrop_path": "/1xQtvgay8rDwSaZPwyhcecqV8UD.jpg",
"original_language": "en",
"original_title": "The Wrong Missy",
"genre_ids": [
35,
10749
],
"title": "The Wrong Missy",
"vote_average": 6.1,
"overview": "A guy meets the woman of his dreams and invites her to his company's corporate retreat, but realizes he sent the invite to the wrong person.",
"release_date": "2020-05-13"
},
{
"popularity": 104.871,
"vote_count": 4967,
"video": false,
"poster_path": "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg",
"id": 530915,
"adult": false,
"backdrop_path": "/2lBOQK06tltt8SQaswgb8d657Mv.jpg",
"original_language": "en",
"original_title": "1917",
"genre_ids": [
28,
18,
36,
53,
10752
],
"title": "1917",
"vote_average": 7.9,
"overview": "At the height of the First World War, two young British soldiers must cross enemy territory and deliver a message that will stop a deadly attack on hundreds of soldiers.",
"release_date": "2019-12-25"
},
{
"popularity": 95.028,
"vote_count": 4516,
"video": false,
"poster_path": "/pjeMs3yqRmFL3giJy4PMXWZTTPa.jpg",
"id": 330457,
"adult": false,
"backdrop_path": "/xJWPZIYOEFIjZpBL7SVBGnzRYXp.jpg",
"original_language": "en",
"original_title": "Frozen II",
"genre_ids": [
12,
16,
10751
],
"title": "Frozen II",
"vote_average": 7.2,
"overview": "Elsa, Anna, Kristoff and Olaf head far into the forest to learn the truth about an ancient mystery of their kingdom.",
"release_date": "2019-11-20"
},
{
"popularity": 92.127,
"vote_count": 9342,
"video": false,
"poster_path": "/qa6HCwP4Z15l3hpsASz3auugEW6.jpg",
"id": 920,
"adult": false,
"backdrop_path": "/sd4xN5xi8tKRPrJOWwNiZEile7f.jpg",
"original_language": "en",
"original_title": "Cars",
"genre_ids": [
12,
16,
35,
10751
],
"title": "Cars",
"vote_average": 6.8,
"overview": "Lightning McQueen, a hotshot rookie race car driven to succeed, discovers that life is about the journey, not the finish line, when he finds himself unexpectedly detoured in the sleepy Route 66 town of Radiator Springs. On route across the country to the big Piston Cup Championship in California to compete against two seasoned pros, McQueen gets to know the town's offbeat characters.",
"release_date": "2006-06-08"
},
{
"popularity": 91.598,
"vote_count": 1845,
"video": false,
"poster_path": "/f4aul3FyD3jv3v4bul1IrkWZvzq.jpg",
"id": 508439,
"adult": false,
"backdrop_path": "/xFxk4vnirOtUxpOEWgA1MCRfy6J.jpg",
"original_language": "en",
"original_title": "Onward",
"genre_ids": [
12,
16,
35,
14,
10751
],
"title": "Onward",
"vote_average": 7.9,
"overview": "In a suburban fantasy world, two teenage elf brothers embark on an extraordinary quest to discover if there is still a little magic left out there.",
"release_date": "2020-02-29"
},
{
"popularity": 90.271,
"vote_count": 4619,
"video": false,
"poster_path": "/db32LaOibwEliAmSL2jjDF6oDdj.jpg",
"id": 181812,
"adult": false,
"backdrop_path": "/jOzrELAzFxtMx2I4uDGHOotdfsS.jpg",
"original_language": "en",
"original_title": "Star Wars: The Rise of Skywalker",
"genre_ids": [
28,
12,
878
],
"title": "Star Wars: The Rise of Skywalker",
"vote_average": 6.5,
"overview": "The surviving Resistance faces the First Order once again as the journey of Rey, Finn and Poe Dameron continues. With the power and knowledge of generations behind them, the final battle begins.",
"release_date": "2019-12-18"
},
{
"popularity": 89.083,
"vote_count": 418,
"video": false,
"poster_path": "/c01Y4suApJ1Wic2xLmaq1QYcfoZ.jpg",
"id": 618344,
"adult": false,
"backdrop_path": "/sQkRiQo3nLrQYMXZodDjNUJKHZV.jpg",
"original_language": "en",
"original_title": "Justice League Dark: Apokolips War",
"genre_ids": [
28,
12,
16,
14,
878
],
"title": "Justice League Dark: Apokolips War",
"vote_average": 8.5,
"overview": "Earth is decimated after intergalactic tyrant Darkseid has devastated the Justice League in a poorly executed war by the DC Super Heroes. Now the remaining bastions of good – the Justice League, Teen Titans, Suicide Squad and assorted others – must regroup, strategize and take the war to Darkseid in order to save the planet and its surviving inhabitants.",
"release_date": "2020-05-05"
},
{
"popularity": 89.031,
"vote_count": 12547,
"video": false,
"poster_path": "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
"id": 475557,
"adult": false,
"backdrop_path": "/f5F4cRhQdUbyVbB5lTNCwUzD6BP.jpg",
"original_language": "en",
"original_title": "Joker",
"genre_ids": [
80,
18,
53
],
"title": "Joker",
"vote_average": 8.2,
"overview": "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
"release_date": "2019-10-02"
},
{
"popularity": 85.911,
"vote_count": 7408,
"video": false,
"poster_path": "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
"id": 496243,
"adult": false,
"backdrop_path": "/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg",
"original_language": "ko",
"original_title": "기생충",
"genre_ids": [
35,
18,
53
],
"title": "Parasite",
"vote_average": 8.5,
"overview": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
"release_date": "2019-05-30"
},
{
"popularity": 81.438,
"vote_count": 16883,
"video": false,
"poster_path": "/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
"id": 671,
"adult": false,
"backdrop_path": "/hziiv14OpD73u9gAak4XDDfBKa2.jpg",
"original_language": "en",
"original_title": "Harry Potter and the Philosopher's Stone",
"genre_ids": [
12,
14,
10751
],
"title": "Harry Potter and the Philosopher's Stone",
"vote_average": 7.9,
"overview": "Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard -- with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school's kindly headmaster, Harry uncovers the truth about his parents' deaths -- and about the villain who's to blame.",
"release_date": "2001-11-16"
},
{
"popularity": 81.051,
"vote_count": 18170,
"video": false,
"poster_path": "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
"id": 299536,
"adult": false,
"backdrop_path": "/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg",
"original_language": "en",
"original_title": "Avengers: Infinity War",
"genre_ids": [
28,
12,
878
],
"title": "Avengers: Infinity War",
"vote_average": 8.3,
"overview": "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
"release_date": "2018-04-25"
},
{
"popularity": 78.641,
"vote_count": 3964,
"video": false,
"poster_path": "/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg",
"id": 38700,
"adult": false,
"backdrop_path": "/upUy2QhMZEmtypPW3PdieKLAHxh.jpg",
"original_language": "en",
"original_title": "Bad Boys for Life",
"genre_ids": [
28,
80,
53
],
"title": "Bad Boys for Life",
"vote_average": 7.2,
"overview": "Marcus and Mike are forced to confront new threats, career changes, and midlife crises as they join the newly created elite team AMMO of the Miami police department to take down the ruthless Armando Armas, the vicious leader of a Miami drug cartel.",
"release_date": "2020-01-15"
},
{
"popularity": 77.003,
"vote_count": 1892,
"video": false,
"poster_path": "/5EufsDwXdY2CVttYOk2WtYhgKpa.jpg",
"id": 570670,
"adult": false,
"backdrop_path": "/uZMZyvarQuXLRqf3xdpdMqzdtjb.jpg",
"original_language": "en",
"original_title": "The Invisible Man",
"genre_ids": [
27,
878,
53
],
"title": "The Invisible Man",
"vote_average": 7.1,
"overview": "When Cecilia's abusive ex takes his own life and leaves her his fortune, she suspects his death was a hoax. As a series of coincidences turn lethal, Cecilia works to prove that she is being hunted by someone nobody can see.",
"release_date": "2020-02-26"
},
{
"popularity": 74.183,
"vote_count": 5867,
"video": false,
"poster_path": "/3iYQTLGoy7QnjcUYRJy4YrAgGvp.jpg",
"id": 420817,
"adult": false,
"backdrop_path": "/v4yVTbbl8dE1UP2dWu5CLyaXOku.jpg",
"original_language": "en",
"original_title": "Aladdin",
"genre_ids": [
12,
35,
14,
10749,
10751
],
"title": "Aladdin",
"vote_average": 7.1,
"overview": "A kindhearted street urchin named Aladdin embarks on a magical adventure after finding a lamp that releases a wisecracking genie while a power-hungry Grand Vizier vies for the same lamp that has the power to make their deepest wishes come true.",
"release_date": "2019-05-22"
}
]
};

var trendingMovies = {
	"page": 1,
	"results": [
		{
			"id": 545609,
			"video": false,
			"vote_count": 977,
			"vote_average": 7.4,
			"title": "Extraction",
			"release_date": "2020-04-24",
			"original_language": "en",
			"original_title": "Extraction",
			"genre_ids": [
			28,
			18,
			53
			],
			"backdrop_path": "/1R6cvRtZgsYCkh8UFuWFN33xBP4.jpg",
			"adult": false,
			"overview": "Tyler Rake, a fearless mercenary who offers his services on the black market, embarks on a dangerous mission when he is hired to rescue the kidnapped son of a Mumbai crime lord…",
			"poster_path": "/wlfDxbGEsW58vGhFljKkcR5IxDj.jpg",
			"popularity": 393.162,
			"media_type": "movie"
		},
		{
			"id": 689723,
			"video": false,
			"vote_count": 21,
			"vote_average": 6.6,
			"title": "Dangerous Lies",
			"release_date": "2020-04-30",
			"original_language": "en",
			"original_title": "Dangerous Lies",
			"genre_ids": [
			53
			],
			"backdrop_path": "/eZZ6FqfhQC3c10WnO5ZKD4E1wX9.jpg",
			"adult": false,
			"overview": "After losing her waitressing job, Katie Franklin takes a job as a caretaker to a wealthy elderly man in his sprawling, empty Chicago estate. The two grow close, but when he unexpectedly passes away and names Katie as his sole heir, she and her husband Adam are pulled into a complex web of lies, deception, and murder. If she's going to survive, Katie will have to question everyone's motives — even the people she loves.",
			"poster_path": "/x0g9tzgZKKmNEtwcjS3aF4kduRi.jpg",
			"popularity": 47.186,
			"media_type": "movie"
		},
		{
			"id": 474764,
			"video": false,
			"vote_count": 69,
			"vote_average": 6.4,
			"title": "The Lodge",
			"release_date": "2020-01-16",
			"original_language": "en",
			"original_title": "The Lodge",
			"genre_ids": [
			18,
			27,
			53
			],
			"backdrop_path": "/4ROohUwL6UJUDgPa4IE1juCsPSb.jpg",
			"adult": false,
			"overview": "A soon-to-be stepmom is snowed in with her fiancé's two children at a remote holiday village. Just as relations begin to thaw between the trio, some strange and frightening events take place.",
			"poster_path": "/yake2myhbW7c6dKbmwYDy1i40bm.jpg",
			"popularity": 45.366,
			"media_type": "movie"
		},
		{
			"id": 181812,
			"video": false,
			"vote_count": 4244,
			"vote_average": 6.5,
			"title": "Star Wars: The Rise of Skywalker",
			"release_date": "2019-12-18",
			"original_language": "en",
			"original_title": "Star Wars: The Rise of Skywalker",
			"genre_ids": [
			28,
			12,
			878
			],
			"backdrop_path": "/jOzrELAzFxtMx2I4uDGHOotdfsS.jpg",
			"adult": false,
			"overview": "The surviving Resistance faces the First Order once again as the journey of Rey, Finn and Poe Dameron continues. With the power and knowledge of generations behind them, the final battle begins.",
			"poster_path": "/db32LaOibwEliAmSL2jjDF6oDdj.jpg",
			"popularity": 145.879,
			"media_type": "movie"
		},
		{
			"id": 338762,
			"video": false,
			"vote_count": 1948,
			"vote_average": 7.2,
			"title": "Bloodshot",
			"release_date": "2020-03-05",
			"original_language": "en",
			"original_title": "Bloodshot",
			"genre_ids": [
			28,
			878
			],
			"backdrop_path": "/ocUrMYbdjknu2TwzMHKT9PBBQRw.jpg",
			"adult": false,
			"overview": "After he and his wife are murdered, marine Ray Garrison is resurrected by a team of scientists. Enhanced with nanotechnology, he becomes a superhuman, biotech killing machine—'Bloodshot'. As Ray first trains with fellow super-soldiers, he cannot recall anything from his former life. But when his memories flood back and he remembers the man that killed both him and his wife, he breaks out of the facility to get revenge, only to discover that there's more to the conspiracy than he thought.",
			"poster_path": "/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg",
			"popularity": 258.754,
			"media_type": "movie"
		},
		{
			"id": 597219,
			"video": false,
			"vote_count": 0,
			"vote_average": 0.0,
			"title": "The Half of It",
			"release_date": "2020-05-01",
			"original_language": "en",
			"original_title": "The Half of It",
			"genre_ids": [
			35,
			10749
			],
			"backdrop_path": "/deTb672Jh4HGh48x4MVwHXIytQU.jpg",
			"adult": false,
			"overview": "Shy, straight-A student Ellie is hired by sweet but inarticulate jock Paul, who needs help wooing the most popular girl in school. But their new and unlikely friendship gets tricky when Ellie discovers she has feelings for the same girl.",
			"poster_path": "/jC1PNXGET1ZZQyrJvdFhPfXdPP1.jpg",
			"popularity": 34.854,
			"media_type": "movie"
		},
		{
			"id": 454626,
			"video": false,
			"vote_count": 3284,
			"vote_average": 7.6,
			"title": "Sonic the Hedgehog",
			"release_date": "2020-02-12",
			"original_language": "en",
			"original_title": "Sonic the Hedgehog",
			"genre_ids": [
			28,
			35,
			878,
			10751
			],
			"backdrop_path": "/stmYfCUGd8Iy6kAMBr6AmWqx8Bq.jpg",
			"adult": false,
			"overview": "Based on the global blockbuster videogame franchise from Sega, Sonic the Hedgehog tells the story of the world’s speediest hedgehog as he embraces his new home on Earth. In this live-action adventure comedy, Sonic and his new best friend team up to defend the planet from the evil genius Dr. Robotnik and his plans for world domination.",
			"poster_path": "/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg",
			"popularity": 169.746,
			"media_type": "movie"
		},
		{
			"id": 530956,
			"video": false,
			"vote_count": 0,
			"vote_average": 0.0,
			"title": "All Day and a Night",
			"release_date": "2020-05-01",
			"original_language": "en",
			"original_title": "All Day and a Night",
			"genre_ids": [
			18
			],
			"backdrop_path": "/puw9y3jcL76FgHRkMeGkMQ9APao.jpg",
			"adult": false,
			"overview": "While serving life in prison, a young man looks back at the people, the circumstances and the system that set him on the path toward his crime.",
			"poster_path": "/8xiV8j18GhWnnrfMGaDR0E5oOif.jpg",
			"popularity": 34.649,
			"media_type": "movie"
		},
		{
			"id": 690369,
			"video": false,
			"vote_count": 6,
			"vote_average": 9.0,
			"title": "LEGO DC: Shazam! Magic and Monsters",
			"release_date": "2020-04-28",
			"original_language": "en",
			"original_title": "LEGO DC: Shazam! Magic and Monsters",
			"genre_ids": [
			28,
			12,
			16,
			35,
			878,
			10751
			],
			"backdrop_path": "/rVK9E8Jyoou4Hv7L3aThk28ctG2.jpg",
			"adult": false,
			"overview": "It’s high time the Justice League took notice of Shazam! (Sean Astin), but joining the world’s greatest team of superheroes is a lot harder when they’ve all been turned into kids.LEGO DC: Shazam! Magic and Monsters will teach Billy Batson the virtues of trust as the hero fights off Mr. Mind and Black Adam.",
			"poster_path": "/ziIyuNNNwYqv0qbOpV9VvvdnRBb.jpg",
			"popularity": 72.359,
			"media_type": "movie"
		},
		{
			"id": 530915,
			"video": false,
			"vote_count": 4523,
			"vote_average": 8.0,
			"title": "1917",
			"release_date": "2019-12-25",
			"original_language": "en",
			"original_title": "1917",
			"genre_ids": [
			28,
			18,
			53,
			10752
			],
			"backdrop_path": "/2WgieNR1tGHlpJUsolbVzbUbE1O.jpg",
			"adult": false,
			"overview": "At the height of the First World War, two young British soldiers must cross enemy territory and deliver a message that will stop a deadly attack on hundreds of soldiers.",
			"poster_path": "/AuGiPiGMYMkSosOJ3BQjDEAiwtO.jpg",
			"popularity": 93.814,
			"media_type": "movie"
		},
		{
			"id": 38700,
			"video": false,
			"vote_count": 3555,
			"vote_average": 7.2,
			"title": "Bad Boys for Life",
			"release_date": "2020-01-15",
			"original_language": "en",
			"original_title": "Bad Boys for Life",
			"genre_ids": [
			28,
			80,
			53
			],
			"backdrop_path": "/upUy2QhMZEmtypPW3PdieKLAHxh.jpg",
			"adult": false,
			"overview": "Marcus and Mike are forced to confront new threats, career changes, and midlife crises as they join the newly created elite team AMMO of the Miami police department to take down the ruthless Armando Armas, the vicious leader of a Miami drug cartel.",
			"poster_path": "/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg",
			"popularity": 116.44,
			"media_type": "movie"
		},
		{
			"id": 542224,
			"video": false,
			"vote_count": 307,
			"vote_average": 6.4,
			"title": "Gretel & Hansel",
			"release_date": "2020-01-30",
			"original_language": "en",
			"original_title": "Gretel & Hansel",
			"genre_ids": [
			14,
			27,
			53
			],
			"backdrop_path": "/jEPEVO48hKQB0EUNFQOSv6qtKNW.jpg",
			"adult": false,
			"overview": "A long time ago in a distant fairy tale countryside, a young girl leads her little brother into a dark wood in desperate search of food and work, only to stumble upon a nexus of terrifying evil.",
			"poster_path": "/mBBBXseq4k4dI63k06XIrsc02j8.jpg",
			"popularity": 64.425,
			"media_type": "movie"
		},
		{
			"id": 480857,
			"video": false,
			"vote_count": 11,
			"vote_average": 7.0,
			"title": "Radioactive",
			"release_date": "2020-03-11",
			"original_language": "en",
			"original_title": "Radioactive",
			"genre_ids": [
			18,
			36,
			10749
			],
			"backdrop_path": "/qyNrodORBG2bpWoj8dLuk5Zk59b.jpg",
			"adult": false,
			"overview": "Tells the story of Nobel Prize winner Marie Curie and her extraordinary scientific discoveries — through the prism of her marriage to husband Pierre — and the seismic and transformative effects their discovery of radium had on the 20th century.",
			"poster_path": "/6PzHJD9RfcFY4D8AisGqHdN6RIA.jpg",
			"popularity": 9.958,
			"media_type": "movie"
		},
		{
			"id": 495764,
			"video": false,
			"vote_count": 3419,
			"vote_average": 7.2,
			"title": "Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)",
			"release_date": "2020-02-05",
			"original_language": "en",
			"original_title": "Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)",
			"genre_ids": [
			28,
			35,
			80
			],
			"backdrop_path": "/uozb2VeD87YmhoUP1RrGWfzuCrr.jpg",
			"adult": false,
			"overview": "Harley Quinn joins forces with a singer, an assassin and a police detective to help a young girl who had a hit placed on her after she stole a rare diamond from a crime lord.",
			"poster_path": "/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg",
			"popularity": 113.249,
			"media_type": "movie"
		},
		{
			"id": 512200,
			"video": false,
			"vote_count": 3463,
			"vote_average": 6.9,
			"title": "Jumanji: The Next Level",
			"release_date": "2019-12-04",
			"original_language": "en",
			"original_title": "Jumanji: The Next Level",
			"genre_ids": [
			12,
			35,
			14
			],
			"backdrop_path": "/zTxHf9iIOCqRbxvl8W5QYKrsMLq.jpg",
			"adult": false,
			"overview": "As the gang return to Jumanji to rescue one of their own, they discover that nothing is as they expect. The players will have to brave parts unknown and unexplored in order to escape the world’s most dangerous game.",
			"poster_path": "/bB42KDdfWkOvmzmYkmK58ZlCa9P.jpg",
			"popularity": 98.963,
			"media_type": "movie"
		},
		{
			"id": 530723,
			"video": false,
			"vote_count": 40,
			"vote_average": 7.2,
			"title": "Bad Education",
			"release_date": "2019-09-08",
			"original_language": "en",
			"original_title": "Bad Education",
			"genre_ids": [
			35,
			18
			],
			"backdrop_path": "/kriOlxu4KVEjd0ZaY3dW7YYyP4z.jpg",
			"adult": false,
			"overview": "A superintendent of a school district works for the betterment of the student’s education while embezzling public funds to live the life he wants.",
			"poster_path": "/gizz5FphOtfSnLaGpRALOZgILd5.jpg",
			"popularity": 89.585,
			"media_type": "movie"
		},
		{
			"id": 299534,
			"video": false,
			"vote_count": 12790,
			"vote_average": 8.3,
			"title": "Avengers: Endgame",
			"release_date": "2019-04-24",
			"original_language": "en",
			"original_title": "Avengers: Endgame",
			"genre_ids": [
			28,
			12,
			878
			],
			"backdrop_path": "/orjiB3oUIsyz60hoEqkiGpy5CeO.jpg",
			"adult": false,
			"overview": "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
			"poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
			"popularity": 55.448,
			"media_type": "movie"
		},
		{
			"id": 639247,
			"video": false,
			"vote_count": 15,
			"vote_average": 7.1,
			"title": "Dreamkatcher",
			"release_date": "2020-04-28",
			"original_language": "en",
			"original_title": "Dreamkatcher",
			"genre_ids": [
			27,
			53
			],
			"backdrop_path": "/wRreALASTO4nXsrJKTwqTLyNjal.jpg",
			"adult": false,
			"overview": "Gail is forced to come to terms with Josh, her new stepson, at a remote country home. After stealing an evil talisman from a mysterious neighbor, Josh has sinister dreams of his dead mother, who commands Josh to murder Gail. When Josh's dad returns, he and Gail suspect that their son has been possessed by an ancient, bloodthirsty spirit. Is it too late to save Josh's life — or their own?",
			"poster_path": "/nD6Vb3qotU1v4J4757OFh5TJ76I.jpg",
			"popularity": 70.773,
			"media_type": "movie"
		},
		{
			"id": 11,
			"video": false,
			"vote_count": 13448,
			"vote_average": 8.2,
			"title": "Star Wars",
			"release_date": "1977-05-25",
			"original_language": "en",
			"original_title": "Star Wars",
			"genre_ids": [
			28,
			12,
			878
			],
			"backdrop_path": "/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg",
			"adult": false,
			"overview": "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
			"poster_path": "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
			"popularity": 67.869,
			"media_type": "movie"
		},
		{
			"adult": false,
			"backdrop_path": "/jLjnuizquGWvGg8D9ztuBvTNeeg.jpg",
			"genre_ids": [
			35,
			18,
			10749
			],
			"id": 656563,
			"original_language": "pt",
			"original_title": "Ricos de Amor",
			"overview": "Working incognito at his rich dad's company to test his own merits, Teto falls for Paula and tells her he grew up poor, a lie that spins out of control.",
			"poster_path": "/u8kRdW12mhOakR9WqVnarQbqGNH.jpg",
			"release_date": "2020-04-30",
			"title": "Rich in Love",
			"video": false,
			"vote_average": 7.1,
			"vote_count": 4,
			"popularity": 30.204,
			"media_type": "movie"
		}
	],
	"total_pages": 1000,
	"total_results": 20000
}
var nowPlaying = {
	"results": [
	{
		"popularity": 264.128,
		"vote_count": 1978,
		"video": false,
		"poster_path": "/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg",
		"id": 338762,
		"adult": false,
		"backdrop_path": "/ocUrMYbdjknu2TwzMHKT9PBBQRw.jpg",
		"original_language": "en",
		"original_title": "Bloodshot",
		"genre_ids": [
		28,
		878
		],
		"title": "Bloodshot",
		"vote_average": 7.1,
		"overview": "After he and his wife are murdered, marine Ray Garrison is resurrected by a team of scientists. Enhanced with nanotechnology, he becomes a superhuman, biotech killing machine—'Bloodshot'. As Ray first trains with fellow super-soldiers, he cannot recall anything from his former life. But when his memories flood back and he remembers the man that killed both him and his wife, he breaks out of the facility to get revenge, only to discover that there's more to the conspiracy than he thought.",
		"release_date": "2020-03-05"
		},
	{
		"popularity": 207.89,
		"vote_count": 3319,
		"video": false,
		"poster_path": "/aQvJ5WPzZgYVDrxLX4R6cLJCEaQ.jpg",
		"id": 454626,
		"adult": false,
		"backdrop_path": "/stmYfCUGd8Iy6kAMBr6AmWqx8Bq.jpg",
		"original_language": "en",
		"original_title": "Sonic the Hedgehog",
		"genre_ids": [
		28,
		35,
		878,
		10751
		],
		"title": "Sonic the Hedgehog",
		"vote_average": 7.6,
		"overview": "Based on the global blockbuster videogame franchise from Sega, Sonic the Hedgehog tells the story of the world’s speediest hedgehog as he embraces his new home on Earth. In this live-action adventure comedy, Sonic and his new best friend team up to defend the planet from the evil genius Dr. Robotnik and his plans for world domination.",
		"release_date": "2020-02-12"
	},
	{
		"popularity": 147.421,
		"vote_count": 6814,
		"video": false,
		"poster_path": "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
		"id": 496243,
		"adult": false,
		"backdrop_path": "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
		"original_language": "ko",
		"original_title": "기생충",
		"genre_ids": [
		35,
		18,
		53
		],
		"title": "Parasite",
		"vote_average": 8.5,
		"overview": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
		"release_date": "2019-05-30"
	},
	{
		"popularity": 134.649,
		"vote_count": 955,
		"video": false,
		"poster_path": "/gzlbb3yeVISpQ3REd3Ga1scWGTU.jpg",
		"id": 443791,
		"adult": false,
		"backdrop_path": "/ww7eC3BqSbFsyE5H5qMde8WkxJ2.jpg",
		"original_language": "en",
		"original_title": "Underwater",
		"genre_ids": [
		28,
		27,
		878,
		53
		],
		"title": "Underwater",
		"vote_average": 6.4,
		"overview": "After an earthquake destroys their underwater station, six researchers must navigate two miles along the dangerous, unknown depths of the ocean floor to make it to safety in a race against time.",
		"release_date": "2020-01-08"
	},
	{
		"popularity": 116.273,
		"vote_count": 880,
		"video": false,
		"poster_path": "/z4A6mFOLTMZAhCSPRyrtzG0SPbd.jpg",
		"id": 475303,
		"adult": false,
		"backdrop_path": "/6fkqwqLEcDZOEAnBBfKAniwNxtx.jpg",
		"original_language": "en",
		"original_title": "A Rainy Day in New York",
		"genre_ids": [
		35,
		10749
		],
		"title": "A Rainy Day in New York",
		"vote_average": 6.5,
		"overview": "Two young people arrive in New York to spend a weekend, but once they arrive they're met with bad weather and a series of adventures.",
		"release_date": "2019-07-26"
	},
	{
		"popularity": 105.336,
		"vote_count": 10,
		"video": false,
		"poster_path": "/7BC2Mv2ekyBIto68YOrc1DRARv6.jpg",
		"id": 597295,
		"adult": false,
		"backdrop_path": "/hOREXWuVMG0xSKjdwh6QeOoJDFo.jpg",
		"original_language": "zh",
		"original_title": "我的青春都是你",
		"genre_ids": [
		35,
		10749
		],
		"title": "Love The Way You Are",
		"vote_average": 4.2,
		"overview": "Opposites clash when spunky girl next door Lin Lin meets eccentric nerd Yuke. Despite being neighbors and schoolmates since childhood, Lin Lin and Yuke barely know each other. When the pair are both admitted into the same university, Lin Lin discovers that Yuke harbors a secret crush for campus beauty, Ruting. Ever the busybody, Lin Lin decides to matchmake Yuke and Ruting, only to find herself gradually falling for Yuke.",
		"release_date": "2019-06-21"
	},
	{
		"popularity": 91.65,
		"vote_count": 1536,
		"video": false,
		"poster_path": "/f4aul3FyD3jv3v4bul1IrkWZvzq.jpg",
		"id": 508439,
		"adult": false,
		"backdrop_path": "/xFxk4vnirOtUxpOEWgA1MCRfy6J.jpg",
		"original_language": "en",
		"original_title": "Onward",
		"genre_ids": [
		12,
		16,
		35,
		14,
		10751
		],
		"title": "Onward",
		"vote_average": 7.9,
		"overview": "In a suburban fantasy world, two teenage elf brothers embark on an extraordinary quest to discover if there is still a little magic left out there.",
		"release_date": "2020-02-29"
	},
	{
		"popularity": 76.796,
		"vote_count": 506,
		"video": false,
		"poster_path": "/7W0G3YECgDAfnuiHG91r8WqgIOe.jpg",
		"id": 446893,
		"adult": false,
		"backdrop_path": "/qsxhnirlp7y4Ae9bd11oYJSX59j.jpg",
		"original_language": "en",
		"original_title": "Trolls World Tour",
		"genre_ids": [
		12,
		16,
		35,
		14,
		10402,
		10751
		],
		"title": "Trolls World Tour",
		"vote_average": 7.6,
		"overview": "Queen Poppy and Branch make a surprising discovery — there are other Troll worlds beyond their own, and their distinct differences create big clashes between these various tribes. When a mysterious threat puts all of the Trolls across the land in danger, Poppy, Branch, and their band of friends must embark on an epic quest to create harmony among the feuding Trolls to unite them against certain doom.",
		"release_date": "2020-03-12"
	},
	{
		"popularity": 73.431,
		"vote_count": 1039,
		"video": false,
		"poster_path": "/jtrhTYB7xSrJxR1vusu99nvnZ1g.jpg",
		"id": 522627,
		"adult": false,
		"backdrop_path": "/tintsaQ0WLzZsTMkTiqtMB3rfc8.jpg",
		"original_language": "en",
		"original_title": "The Gentlemen",
		"genre_ids": [
		28,
		35,
		80
		],
		"title": "The Gentlemen",
		"vote_average": 7.8,
		"overview": "American expat Mickey Pearson has built a highly profitable marijuana empire in London. When word gets out that he’s looking to cash out of the business forever it triggers plots, schemes, bribery and blackmail in an attempt to steal his domain out from under him.",
		"release_date": "2020-01-01"
	},
	{
		"popularity": 72.866,
		"vote_count": 43,
		"video": false,
		"poster_path": "/v1DbnzXChoymNghOGAjFUZ9KYP1.jpg",
		"id": 430155,
		"adult": false,
		"backdrop_path": "/oVLGuq431nF3f0yDi07q1gL4ehK.jpg",
		"original_language": "ru",
		"original_title": "Кома",
		"genre_ids": [
		28,
		12,
		14,
		10749
		],
		"title": "The Coma",
		"vote_average": 5.1,
		"overview": "After a colossal and mysterious accident a young talented architect comes back to his senses in a very odd world that only resembles the reality. This world is based on the memories of the ones who live in it - people who are currently finding themselves in a deep coma. Human memory is spotty, chaotic and unstable. The same is the COMA - odd collection of memories and recollections - cities, glaciers and rivers can all be found in one room. All the laws of physics can be broken. The architect must find out the exact laws and regulations of COMA as he fights for his life, meets the love of his life and keeps on looking for the exit to the real world which he will have to get acquainted with all over again after the experience of COMA.",
		"release_date": "2019-11-19"
	},
	{
		"popularity": 72.84,
		"vote_count": 1677,
		"video": false,
		"poster_path": "/5EufsDwXdY2CVttYOk2WtYhgKpa.jpg",
		"id": 570670,
		"adult": false,
		"backdrop_path": "/uZMZyvarQuXLRqf3xdpdMqzdtjb.jpg",
		"original_language": "en",
		"original_title": "The Invisible Man",
		"genre_ids": [
		27,
		878,
		53
		],
		"title": "The Invisible Man",
		"vote_average": 7.1,
		"overview": "When Cecilia's abusive ex takes his own life and leaves her his fortune, she suspects his death was a hoax. As a series of coincidences turn lethal, Cecilia works to prove that she is being hunted by someone nobody can see.",
		"release_date": "2020-02-26"
	},
	{
		"popularity": 66.947,
		"vote_count": 468,
		"video": false,
		"poster_path": "/8ZMrZGGW65ePWIgRn1260nA1uUm.jpg",
		"id": 539537,
		"adult": false,
		"backdrop_path": "/x80ZIVGUJ6plcUBcgVZ6DPKT7vc.jpg",
		"original_language": "en",
		"original_title": "Fantasy Island",
		"genre_ids": [
		14,
		27,
		878
		],
		"title": "Fantasy Island",
		"vote_average": 5.8,
		"overview": "A group of contest winners arrive at an island hotel to live out their dreams, only to find themselves trapped in nightmare scenarios.",
		"release_date": "2020-02-12"
	},
	{
		"popularity": 64.295,
		"vote_count": 1370,
		"video": false,
		"poster_path": "/xnjvwfDulnOCy8qtYX0iqydmMhk.jpg",
		"id": 448119,
		"adult": false,
		"backdrop_path": "/xcUf6yIheo78btFqihlRLftdR3M.jpg",
		"original_language": "en",
		"original_title": "Dolittle",
		"genre_ids": [
		12,
		35,
		14,
		10751
		],
		"title": "Dolittle",
		"vote_average": 6.8,
		"overview": "After losing his wife seven years earlier, the eccentric Dr. John Dolittle, famed doctor and veterinarian of Queen Victoria’s England, hermits himself away behind the high walls of Dolittle Manor with only his menagerie of exotic animals for company. But when the young queen falls gravely ill, a reluctant Dolittle is forced to set sail on an epic adventure to a mythical island in search of a cure, regaining his wit and courage as he crosses old adversaries and discovers wondrous creatures.",
		"release_date": "2020-01-01"
	},
	{
		"popularity": 60.931,
		"vote_count": 267,
		"video": false,
		"poster_path": "/h1JzHjFJXNJb3QTCwWmm2UbWEwn.jpg",
		"id": 585244,
		"adult": false,
		"backdrop_path": "/rMkheZl9Zi2auEQp877cOWUTCKs.jpg",
		"original_language": "en",
		"original_title": "I Still Believe",
		"genre_ids": [
		18,
		10402
		],
		"title": "I Still Believe",
		"vote_average": 7.7,
		"overview": "The true-life story of Christian music star Jeremy Camp and his journey of love and loss that looks to prove there is always hope.",
		"release_date": "2020-03-12"
	},
	{
		"popularity": 56.553,
		"vote_count": 648,
		"video": false,
		"poster_path": "/33VdppGbeNxICrFUtW2WpGHvfYc.jpg",
		"id": 481848,
		"adult": false,
		"backdrop_path": "/yFRpUmsreYO5Bc0HVBTsJsHIIox.jpg",
		"original_language": "en",
		"original_title": "The Call of the Wild",
		"genre_ids": [
		12,
		18,
		10751
		],
		"title": "The Call of the Wild",
		"vote_average": 7,
		"overview": "Buck is a big-hearted dog whose blissful domestic life is turned upside down when he is suddenly uprooted from his California home and transplanted to the exotic wilds of the Yukon during the Gold Rush of the 1890s. As the newest rookie on a mail delivery dog sled team—and later its leader—Buck experiences the adventure of a lifetime, ultimately finding his true place in the world and becoming his own master.",
		"release_date": "2020-02-19"
	},
	{
		"popularity": 51.877,
		"vote_count": 0,
		"video": false,
		"poster_path": "/eGHgHaujP6BqSCbfAHBuNWXXMOa.jpg",
		"id": 661881,
		"adult": false,
		"backdrop_path": "/dywzFmT8lgsKzh1NjdgWc3Z5HKm.jpg",
		"original_language": "en",
		"original_title": "Home Sweet Home",
		"genre_ids": [
		35,
		18,
		10749
		],
		"title": "Home Sweet Home",
		"vote_average": 0,
		"overview": "Bored with her social butterfly lifestyle, Victoria Tremont longs to find that special someone. Naturally, when a handsome stranger walks into the coffee shop where she works, she turns on the charm. But when he fails to respond to her flirting the way men usually do, she’s perplexed. She finds out that he runs a ministry that builds affordable housing, and sees that if she wants to get his attention, all she has to do is volunteer. So what if it’s a faith-based ministry. Pretending to be a “church person” isn’t any different than pretending to like sports or a guy’s friends, right?",
		"release_date": "2020-05-01"
	},
	{
		"popularity": 51.133,
		"vote_count": 7,
		"video": false,
		"poster_path": "/3xPMEWPTp3VkBBYGnp8rlPZP110.jpg",
		"id": 678314,
		"adult": false,
		"backdrop_path": "/gnYlSwW4mARut9Xfxk41kPgmHth.jpg",
		"original_language": "es",
		"original_title": "Andrés Iniesta, The Unexpected Hero",
		"genre_ids": [
		99
		],
		"title": "Andrés Iniesta, The Unexpected Hero",
		"vote_average": 4.6,
		"overview": "This is the story of a normal person who does extraordinary things. Someone who pursues and achieves triumphs through taking care of the small details, because these are, after all, the ones that make him a different soccer player.",
		"release_date": "2020-04-23"
	},
	{
		"popularity": 50.202,
		"vote_count": 1983,
		"video": false,
		"poster_path": "/yn5ihODtZ7ofn8pDYfxCmxh8AXI.jpg",
		"id": 331482,
		"adult": false,
		"backdrop_path": "/3uTxPIdVEXxHpsHOHdJC24QebBV.jpg",
		"original_language": "en",
		"original_title": "Little Women",
		"genre_ids": [
		18,
		10749
		],
		"title": "Little Women",
		"vote_average": 7.9,
		"overview": "Four sisters come of age in America in the aftermath of the Civil War.",
		"release_date": "2019-12-25"
	},
	{
		"popularity": 47.317,
		"vote_count": 14041,
		"video": false,
		"poster_path": "/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
		"id": 263115,
		"adult": false,
		"backdrop_path": "/yEv8c6i79vk06sZDC3Z9D8HQLVV.jpg",
		"original_language": "en",
		"original_title": "Logan",
		"genre_ids": [
		28,
		18,
		878
		],
		"title": "Logan",
		"vote_average": 7.8,
		"overview": "In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But Logan's attempts to hide from the world and his legacy are upended when a young mutant arrives, pursued by dark forces.",
		"release_date": "2017-02-28"
	},
	{
		"popularity": 46.99,
		"vote_count": 1,
		"video": false,
		"poster_path": "/luf4OthJT845DF4BTMun4TRmh69.jpg",
		"id": 579400,
		"adult": false,
		"backdrop_path": "/5NUzfzdMzdHULAlk4ynrMP5vIrR.jpg",
		"original_language": "en",
		"original_title": "Stardust",
		"genre_ids": [
		18
		],
		"title": "Stardust",
		"vote_average": 7,
		"overview": "David Bowie went to America for the first time to promote his third album, The Man Who Sold the World. There, he embarked on a coast-to-coast publicity tour. During this tour, Bowie came up with the idea of his iconic Ziggy Stardust character, inspired by artists like Iggy Pop and Lou Reed.",
		"release_date": "2020-05-01"
	}
	],
	"page": 1,
	"total_results": 703,
	"dates": {
	"maximum": "2020-05-07",
	"minimum": "2020-03-20"
	},
	"total_pages": 36
}
var upcoming = {
"results": [
{
"popularity": 3.037,
"id": 673756,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "There Will Be Spring",
"release_date": "2020-05-15",
"original_language": "fi",
"original_title": "Syksyn jälkeen saapuu kevät",
"genre_ids": [
18,
10749
],
"backdrop_path": "/udYzNkRf0YFFPf6I3hjezkQTOli.jpg",
"adult": false,
"overview": "Late 40’s after the war. Strange languaged and religioned immigrants fleeing from Karelia region are hated by Finns in the countryside. 19-year old Anni is living her life wanting to forget the war and hostility surrounding her. Falling in love with a man who hasn’t left fighting, threatens Anni’s whole family’s future and hope for mutual forgiveness..",
"poster_path": null
},
{
"popularity": 3.015,
"vote_count": 0,
"video": false,
"poster_path": "/j1HciMLzAhR9iLsDmMN6kWA2mOQ.jpg",
"id": 663508,
"adult": false,
"backdrop_path": "/p9ZUvFjgnzqW2qaWMggvUXcQiXK.jpg",
"original_language": "es",
"original_title": "Amor en polvo",
"genre_ids": [
35,
10749
],
"title": "Amor en polvo",
"vote_average": 0,
"overview": "",
"release_date": "2020-05-22"
},
{
"popularity": 2.974,
"id": 682134,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "The Gigilotti Case",
"release_date": "2020-05-19",
"original_language": "en",
"original_title": "The Gigilotti Case",
"genre_ids": [
53,
27,
14
],
"backdrop_path": null,
"adult": false,
"overview": "A Private Detective investigates a mysterious gang.",
"poster_path": null
},
{
"popularity": 2.974,
"vote_count": 1,
"video": false,
"poster_path": "/5NvmDj6sXvJ3TGha4utgRKpJKvF.jpg",
"id": 593959,
"adult": false,
"backdrop_path": "/t40Nr7RaIWFCWqQJOfttXA9KezF.jpg",
"original_language": "ko",
"original_title": "뽀로로 극장판 보물섬 대모험",
"genre_ids": [
12,
16,
14
],
"title": "Pororo 5: Treasure Island Adventure",
"vote_average": 9,
"overview": "Pororo and his friends at the pirate restaurant accidentally take a treasure map of the legendary treasure and head to the treasure island.  While searching for friends scattered on the mysterious treasure island where the secrets of ancient civilization are kept, they meet a long-trapped pirate hero, Captain Silver, and solves the mystery of the treasure map with him.",
"release_date": "2019-02-01"
},
{
"popularity": 2.901,
"vote_count": 3,
"video": false,
"poster_path": "/jBQI84IKSDF2kJLHIcV7ITzI0Ig.jpg",
"id": 614424,
"adult": false,
"backdrop_path": "/7DROnfY5uKzpWYkK6jcq2yYqnll.jpg",
"original_language": "ru",
"original_title": "Зима",
"genre_ids": [
28,
18
],
"title": "Winter",
"vote_average": 8,
"overview": "On the way home in a strange city, Alexander and his father are seriously injured by drunken juvenile delinquents. The father dies, and Alexander becomes a dangerous witness, which must be eliminated. He is forced to start the persecution himself and very soon turns from a victim into a cold-blooded hunter.",
"release_date": "2020-02-27"
},
{
"popularity": 2.893,
"vote_count": 0,
"video": false,
"poster_path": "/uQRNgNZ4n4iQhOnR1cMxLOeukQe.jpg",
"id": 602291,
"adult": false,
"backdrop_path": "/sRHssI6JWtX3lhBWAfLU6zwFpZy.jpg",
"original_language": "ko",
"original_title": "침입자",
"genre_ids": [
9648,
53
],
"title": "Intruder",
"vote_average": 0,
"overview": "Seo-Jin (Kim Moo-Yul) is a popular architect. He suffers from a trauma when his younger sister Yoo-Jin went missing. His sister’s disappearance occured when Seo-Jin was a child. 25 years after her disappearance, Yoo-Jin comes back to her family. Seo-Jin feels something is not right with Yoo-Jin (Song Ji-Hyo).",
"release_date": "2020-05-21"
},
{
"popularity": 2.744,
"id": 698320,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "The Mad Hatter",
"release_date": "2020-05-15",
"original_language": "en",
"original_title": "The Mad Hatter",
"genre_ids": [
27,
53
],
"backdrop_path": null,
"adult": false,
"overview": "No overview given yet.",
"poster_path": null
},
{
"popularity": 2.735,
"id": 695376,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "Gone Wednesday",
"release_date": "2020-05-15",
"original_language": "ja",
"original_title": "水曜日が消えた",
"genre_ids": [],
"backdrop_path": "/aNQpyCnY1uGzMQPKlsjXvnC6ADv.jpg",
"adult": false,
"overview": "This is a work depicting a man suffering from dissociative identity disorder, who is different on each day of the week, from the perspective of \"I\" on Tuesday.",
"poster_path": "/zjo1JV55jDNrDJjEGnbBquezgk1.jpg"
},
{
"popularity": 2.615,
"vote_count": 0,
"video": false,
"poster_path": "/s00TRefkFnDMdbvUzlt8YN7r3n4.jpg",
"id": 647745,
"adult": false,
"backdrop_path": null,
"original_language": "fr",
"original_title": "Belle fille",
"genre_ids": [
35
],
"title": "Belle fille",
"vote_average": 0,
"overview": "A woman finds out that her husband is cheating on her and decides to spend a weekend of folie in Corsega.",
"release_date": "2020-05-20"
},
{
"popularity": 2.561,
"vote_count": 0,
"video": false,
"poster_path": "/zyU85BxcPdXItnuhtOSUS2T7OPu.jpg",
"id": 694006,
"adult": false,
"backdrop_path": "/76XT95DuO7UwWjMyiciGMbh6Tkk.jpg",
"original_language": "pt",
"original_title": "Algo de Errado Não Está Certo",
"genre_ids": [
35
],
"title": "Algo de Errado Não Está Certo",
"vote_average": 0,
"overview": "",
"release_date": "2020-05-15"
},
{
"popularity": 2.561,
"vote_count": 0,
"video": false,
"poster_path": "/iqm2CfZ9UTaNYmp0Fd9ZXnM1KFx.jpg",
"id": 682866,
"adult": false,
"backdrop_path": "/gBYh9vgl9hUIS0MqXkT885pQIvd.jpg",
"original_language": "pa",
"original_title": "Daddy Cool Munde Fool 2",
"genre_ids": [],
"title": "Daddy Cool Munde Fool 2",
"vote_average": 0,
"overview": "Daddy Cool Munde Fool 2",
"release_date": "2020-05-15"
},
{
"popularity": 2.479,
"vote_count": 0,
"video": false,
"poster_path": "/aPXuDQrNT6lID8PDVSvpQ5w6NDo.jpg",
"id": 575604,
"adult": false,
"backdrop_path": "/6db4eOJylkrOm3bKd0qhV0iEF8r.jpg",
"original_language": "ko",
"original_title": "콜",
"genre_ids": [
53
],
"title": "Call",
"vote_average": 0,
"overview": "When 28-year-old Seo-yeon gets a call from a woman named Young-sook asking for her friend. Seo-yeon hangs up thinking the woman has the wrong number, but later learns that the call was coming from the same house 20 years ago.",
"release_date": "2020-03-31"
},
{
"popularity": 2.445,
"vote_count": 0,
"video": false,
"poster_path": "/2TBZTojfZcqofQy9nDS34OOCgvO.jpg",
"id": 678361,
"adult": false,
"backdrop_path": null,
"original_language": "es",
"original_title": "La vía del eros",
"genre_ids": [],
"title": "La vía del eros",
"vote_average": 0,
"overview": "",
"release_date": "2020-05-15"
},
{
"popularity": 2.399,
"vote_count": 0,
"video": false,
"poster_path": null,
"id": 638965,
"adult": false,
"backdrop_path": null,
"original_language": "fr",
"original_title": "Mandibules",
"genre_ids": [
35,
14
],
"title": "Mandibules",
"vote_average": 0,
"overview": "Two simple-minded friends discover a giant fly in the trunk of a car and decide to domesticate it to earn money with it.",
"release_date": "2020-05-20"
},
{
"popularity": 2.367,
"vote_count": 0,
"video": false,
"poster_path": "/7rTlOCYgKX9vO2C6fAvzqdBh0VC.jpg",
"id": 694237,
"adult": false,
"backdrop_path": null,
"original_language": "es",
"original_title": "Un Baile Con Fred Abstrait seguido de Una Película En Color",
"genre_ids": [],
"title": "Un Baile Con Fred Abstrait seguido de Una Película En Color",
"vote_average": 0,
"overview": "",
"release_date": "2020-05-16"
},
{
"popularity": 2.306,
"vote_count": 0,
"video": false,
"poster_path": "/l1RyYJPnGGWJaUjj9v8xHloD3Mg.jpg",
"id": 683861,
"adult": false,
"backdrop_path": null,
"original_language": "id",
"original_title": "#BerhentiDiKamu",
"genre_ids": [
18
],
"title": "#BerhentiDiKamu",
"vote_average": 0,
"overview": "Based on a novel by Gia Pratama.",
"release_date": "2020-05-21"
},
{
"popularity": 2.298,
"vote_count": 0,
"video": false,
"poster_path": "/5OlkkXhChuKy2DXIQSsQlQofQg8.jpg",
"id": 619019,
"adult": false,
"backdrop_path": "/ueVvqQqN0pPdtOUTv5ChAgb89dy.jpg",
"original_language": "nl",
"original_title": "Rundfunk: Jachterwachter",
"genre_ids": [
35
],
"title": "Rundfunk: Jachterwachter",
"vote_average": 0,
"overview": "The hard-working Guardian runs the HIVO campsite without assistance. The arrival of the faded celebrity Ronnie Bosboom Jr. seems like a blessing, but when it turns out he is running from dangerous criminals, the duo has to do whatever they can to save the camping.",
"release_date": "2020-05-21"
},
{
"popularity": 2.296,
"id": 683371,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "Kuntilanak 3",
"release_date": "2020-05-21",
"original_language": "id",
"original_title": "Kuntilanak 3",
"genre_ids": [
27
],
"backdrop_path": null,
"adult": false,
"overview": "Plot unknown.",
"poster_path": null
},
{
"popularity": 2.273,
"id": 683374,
"video": false,
"vote_count": 0,
"vote_average": 0,
"title": "Yowis Ben 3",
"release_date": "2020-05-21",
"original_language": "id",
"original_title": "Yowis Ben 3",
"genre_ids": [
35
],
"backdrop_path": null,
"adult": false,
"overview": "Plot unknown.",
"poster_path": "/qCOBtAaG1IceuqgcipXdDTmRFQP.jpg"
},
{
"popularity": 2.199,
"vote_count": 0,
"video": false,
"poster_path": "/fCDT6ZOoM6lFkcPdwqy9wi3q9xz.jpg",
"id": 679891,
"adult": false,
"backdrop_path": "/5G9pxDMpOlFThkms5fPzxRTC59d.jpg",
"original_language": "es",
"original_title": "Un mundo normal",
"genre_ids": [
18
],
"title": "A normal world",
"vote_average": 0,
"overview": "",
"release_date": "2020-05-22"
}
],
"page": 4,
"total_results": 86,
"dates": {
"maximum": "2020-05-25",
"minimum": "2020-05-08"
},
"total_pages": 5
}

var movieDetails = {
  Title: 'Extraction',
  Year: '2020',
  Rated: 'R',
  Released: '24 Apr 2020',
  Runtime: '116 min',
  Genre: 'Action, Thriller',
  Director: 'Sam Hargrave',
  Writer: 'Joe Russo (screenplay), Ande Parks (based on the graphic novel "Ciudad" by), Ande Parks (from story by), Joe Russo (from story by), Anthony Russo (from story by), Fernando León González (with illustrations by)',
  Actors: 'Chris Hemsworth, Bryon Lerum, Ryder Lerum, Rudhraksh Jaiswal',
  Plot: "Tyler Rake, a fearless black market mercenary, embarks on the most deadly extraction of his career when he's enlisted to rescue the kidnapped son of an imprisoned international crime lord.",
  Language: 'English, Hindi, Bengali',
  Country: 'USA',
  Awards: 'N/A',
  Poster: 'https://m.media-amazon.com/images/M/MV5BMDJiNzUwYzEtNmQ2Yy00NWE4LWEwNzctM2M0MjE0OGUxZTA3XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '6.8/10' },
    { Source: 'Metacritic', Value: '56/100' }
  ],
  Metascore: '56',
  imdbRating: '6.8',
  imdbVotes: '87,160',
  imdbID: 'tt8936646',
  Type: 'movie',
  DVD: 'N/A',
  BoxOffice: 'N/A',
  Production: 'N/A',
  Website: 'N/A',
  Response: 'True'
}