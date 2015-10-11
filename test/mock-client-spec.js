"use strict";
var MockClient = require("./mock-client");

describe(" mock client", function() {

	it("should load", function() {
		expect(MockClient).toBeDefined();
	});

	describe(" mock send edges in a frame", function() {
		it("should have a sendData function", function(done) {
			var client = new MockClient();
			client.sendData().then(function(response) {
				console.log("  response ", response);
				expect(response).toBeDefined();
				expect(JSON.parse(response).ok).toBeTruthy();
				client.stop = true;
			}, function(reason) {
				if (reason.code) {
					expect(reason.code).toEqual("ECONNREFUSED");
					expect(reason.message).toEqual("maybe you didnt turn on the server?");
				} else {
					expect(reason.error).toEqual("lines were not provided.");
				}
				client.stop = true;
			}).catch(function(exception) {
				console.log(exception.stack);
				expect(exception).toEqual("should not throw an exception");
				client.stop = true;
			}).done(done);
		}, 2000);
	});


	xdescribe("generate fake data", function() {

		it("should have a seed generator", function() {
			var client = new MockClient();
			expect(client.generateSeed).toBeDefined();
		});
		it("should have a delta generator", function() {
			var client = new MockClient();
			expect(client.generateDataFromSeed).toBeDefined();
		});

		it("should generator a seed set of data", function() {
			var data = new MockClient().generateSeed({
				width: 1096,
				height: 800,
				jump: 10,
				vectorCount: 5,
				vectorMeanLength: 10,
				curve: -3
			});
			expect(data.length).toEqual(5);
			data.map(function(vector) {
				expect(vector.length <= 15 && vector.length >= 5).toBeTruthy();
			});
		});

		it("should generate data", function() {
			var data = new MockClient({
				width: 1096,
				height: 800,
				jump: 10,
				vectorCount: 5,
				vectorMeanLength: 10,
				curve: -3
			}).generateDataFromSeed();

			expect(data.length >= 4 && data.length <= 6).toBeTruthy();
			data.map(function(vector) {
				console.log(vector.length);
				expect(vector.length = 1 || (vector.length <= 15 && vector.length >= 8)).toBeTruthy();
			});
		});

		it("should generator data based on a seed", function() {
			var currentFrame = [
				[{
					"x": 1024.0,
					"y": 718.0
				}],
				[{
					"x": 1017.0,
					"y": 717.0
				}, {
					"x": 1016.0,
					"y": 718.0
				}, {
					"x": 1015.0,
					"y": 718.0
				}, {
					"x": 1016.0,
					"y": 718.0
				}, {
					"x": 1017.0,
					"y": 717.0
				}, {
					"x": 1018.0,
					"y": 718.0
				}]
			];
			var nextFrame = new MockClient().generateDataFromSeed(currentFrame);

			console.log(nextFrame);
			expect(nextFrame.length >= 2 && nextFrame.length <= 4).toBeTruthy();
			nextFrame.map(function(vector) {
				console.log(vector.length);

				expect(vector.length <= 7 && vector.length >= 0).toBeTruthy();
			});
		});
	});
});
