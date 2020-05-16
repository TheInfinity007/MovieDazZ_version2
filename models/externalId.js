var mongoose = require('mongoose');
var externalSchema = mongoose.Schema({
	tmdbId:String,
	imdbId:String
});
var ExternalIdsData = mongoose.model("ExternalIdsData", externalSchema);
module.exports= ExternalIdsData;