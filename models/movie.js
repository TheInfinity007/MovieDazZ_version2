const mongoose = require('mongoose');

var movieSchema = new mongoos.Schema({
	title:String,
	imdbId: { type:String, unique: true },
	imgUrl: String,
	release: String
});

module.exports = mongoose.model("Movie", movieSchema);