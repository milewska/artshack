var _ = require("underscore");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var MockClient = require("./test/mock-client");
var mockClientUntilARealOneConnects;

app.use(bodyParser.json({
	limit: "5000kb"
}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

var shipFrame = _.throttle(function(data) {
	io.emit("frame", data);
}, 1000 / 30);

app.post("/frame", function(req, res) {
	if (req.body && req.body.lines && req.body.lines.length) {
		// Turn off mock client if a real one connected.
		if (req.body.clientId && typeof req.body.clientId.indexOf === "function" && req.body.clientId.indexOf("mockClient") !== 0) {
			mockClientUntilARealOneConnects.stop = true;
		}
		console.log("Sent frame with " + req.body.lines.length + " vectors");
		shipFrame(req.body.lines);
		res.send({
			ok: true
		});
	} else {
		res.status(400);
		res.send({
			error: "lines were not provided."
		});
	}
});

server.listen(process.env.PORT || 3000, function() {
	console.log("ready");
});


setTimeout(function() {
	mockClientUntilARealOneConnects = new MockClient();
	mockClientUntilARealOneConnects.sendData();
}, 1000);
