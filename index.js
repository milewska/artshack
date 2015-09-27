var _ = require("underscore");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);


app.use(bodyParser.json({ limit: "5000kb" }));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

var shipFrame = _.throttle(function(data) {
	io.emit("frame", data);
}, 1000/30);

app.post("/frame", function(req, res) {
	shipFrame(req.body);
	res.send({ ok: true });
});

server.listen(process.env.PORT || 3000, function() {
	console.log("ready");
});


