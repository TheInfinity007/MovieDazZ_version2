const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res)=>{
	res.render("index");
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log("MovieDazZ Has Started");
	console.log("Server is listening at 'localhost:3000'");
});