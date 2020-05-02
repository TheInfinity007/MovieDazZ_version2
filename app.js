const express = require('express');
const request = require('request');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// app.get("/", (req, res)=>{
// 	var url = "https://api.themoviedb.org/3/trending/movie/day?api_key=1b58a6bfefb9d8ebd9a671fc53e4e9c9";
// 	request(url, (error, response, body)=>{
// 		console.log(body);
// 		console.log("Results");
// 		let data = JSON.parse(body);
// 		res.send(data);
// 		// res.render("index");
// 	});
// });
app.get("/", (req, res)=>{
	var myTrendingMovies = [];
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
	res.render("index", {trendingMovies: myTrendingMovies});
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log('MovieDazZ Has Started');
	console.log('Server is listening at localhost:3000');
});







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












