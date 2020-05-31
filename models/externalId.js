var mongoose = require('mongoose');
var externalSchema = mongoose.Schema({
	tmdbId:String,
	imdbId:String,
	posterPath:String
});
var ExternalIdsData = mongoose.model("ExternalIdsData", externalSchema);
module.exports= ExternalIdsData;