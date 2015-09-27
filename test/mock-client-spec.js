"use strict";
var MockClient = require("./mock-client");

describe(" mock client", function() {

	it("should load", function() {
		expect(MockClient).toBeDefined();
	});

	describe(" mock send edges in a frame", function() {


	});


	describe("generate fake data", function() {

		it("should have a seed generator", function() {
			var client = new MockClient();
			expect(client.generateSeed).toBeDefined();
		});
		it("should have a delta generator", function() {
			var client = new MockClient();
			expect(client.generateData).toBeDefined();
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
			}).generateData();

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
			var nextFrame = new MockClient().generateData(currentFrame);

			console.log(nextFrame);
			expect(nextFrame.length >= 2 && nextFrame.length <= 4).toBeTruthy();
			nextFrame.map(function(vector) {
				console.log(vector.length);

				expect(vector.length <= 7 && vector.length >= 0).toBeTruthy();
			});
		});
	});
});
