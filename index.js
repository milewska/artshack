var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res, next) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/frame", function(req, res, next) {
	io.emit('frame', req.body);
	res.send({ ok: true });
});

server.listen(3000, function() {
	console.log("ready");
});
