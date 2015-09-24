var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res, next) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/contours", function(req, res, next) {
	console.log(req.body);
	res.send("OK");
});

app.listen(3000, function() {
	console.log("ready");
});
