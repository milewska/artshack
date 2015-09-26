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

		it("should have a seed generator", function() {
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
	});
});
