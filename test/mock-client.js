"use strict";
var request = require("request");

var MockClient = function(options) {
	console.log("Constructing a mock client ", options);

	return {
		timeout: 5000,
		stop: false,
		debug: function() {
			console.log.apply(this, arguments);
		},
		mockDataAndLoop: function(seed) {
			var self = this;
			request({
				method: "POST",
				url: "http://localhost:3000/frame",
				data: seed
			}, function(sessionerror, sessionresponse, sessionbody) {
				console.log(sessionerror, sessionbody);

				setTimeout(function() {
					if (!self.stop) {
						self.mockDataAndLoop(seed);
					}
				}, self.timeout);
			});
		},
		generateData: function(vectors) {
			if (!vectors) {
				vectors = this.generateSeed();
			}
			return vectors.map(function(vector) {
				return vector.map(function(point) {
					return {
						x: point.x + Math.random(),
						y: point.y + Math.random()
					};
				});
			});
		},
		/**
		 * Generate array of vectors of points similar to the output of OpenCV edge detection
		 * 
		 * @param  {Object} options Optiona parameters to geenerate data shapes
		 * @return {Array}         
		 */
		generateSeed: function(options) {
			if (!options) {
				options = {
					width: 1096,
					height: 800,
					jump: 10,
					vectorCount: 5,
					vectorMeanLength: 10
				};
			}
			var data = [];
			var vector;
			var length;
			var previousPoint;
			var currentPoint;
			var i, p;
			for (i = 0; i < options.vectorCount; i++) {
				vector = [];
				length = (Math.random() * options.vectorMeanLength / 4) + options.vectorMeanLength / 2;
				previousPoint = {
					x: Math.round(Math.random() * options.width),
					y: Math.round(Math.random() * options.height)
				};
				for (p = 0; p < length; p++) {
					currentPoint = {
						x: Math.round(previousPoint.x + Math.random() * options.jump),
						y: Math.round(previousPoint.y + Math.random() * options.jump)
					};
					vector.push(currentPoint);
					previousPoint = currentPoint;
				}
				this.debug("built vector " + i, vector);

				data.push(vector);
			}
			return data;
		}
	};
};

module.exports = MockClient;
