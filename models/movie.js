const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
	title:String,
	imdbId: { type:String, unique: true },
	imgUrl: String,
	release: String
});

module.exports = mongoose.model("Movie", movieSchema);