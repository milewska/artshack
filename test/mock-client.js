"use strict";
var request = require("request");
var Promise = require("bluebird");

var newRandomPoint = function(width, height) {
	// console.log(" newRandomPoint", width, height);
	return {
		x: Math.round(Math.random() * width),
		y: Math.round(Math.random() * height)
	};
};

var changePointByDelta = function(point, delta) {
	// console.log(" changePointByDelta", point, delta);
	delta = delta || 10;
	return {
		x: Math.round(point.x + Math.random() * delta),
		y: Math.round(point.y + Math.random() * delta)
	};
};

var growOrShrinkVectors = function(vectors, newItem) {
	if (Math.random() > 0.5) {
		// console.log(" growing from " + vectors.length);
		if (Math.random() > 0.5) {
			vectors.unshift(newItem);
		} else {
			vectors.push(newItem);
		}
	} else {
		if (vectors.length) {
			// console.log(" shrinking from " + vectors.length);
			if (Math.random() > 0.5) {
				// Remove one from this vector or one of its children
				if (vectors[0].length) {
					vectors[0].shift();
				} else {
					vectors.shift();
				}
			} else {
				if (vectors[vectors.length - 1].length) {
					vectors[vectors.length - 1].pop();
				} else {
					vectors.pop();
				}
			}
		}
	}
};

var MockClient = function(options) {
	// console.log("Constructing a mock client ", options);
	if (!options) {
		options = {
			width: 1096,
			height: 800,
			jump: 10,
			vectorCount: 5,
			vectorMeanLength: 10
		};
	}

	return {
		clientId: Date.now(),
		width: options.width || 1000,
		height: options.height || 600,
		timeout: 5000,
		stop: false,
		debug: function() {
			// console.log.apply(this, arguments);
		},
		sendData: function(data) {
			var self = this;
			if (!data) {
				data = this.generateDataFromSeed();
			}
			// console.log("sending data", data);
			return new Promise(function(resolve, reject) {
				request({
					method: "POST",
					url: "http://localhost:3000/frame",
					json: {
						clientId: self.clientId,
						lines: data
					}
				}, function(error, response, body) {
					console.log(error, resolve, body);
					if (error) {
						reject(error);
					} else {
						if (body) {
							try {
								body = JSON.parse(body);
							} catch (e) {}
						}
						if (body.error) {
							reject(body);
						}
						resolve(body);
					}
					setTimeout(function() {
						if (self.stop) {
							self = null;
							return;
						}
						self.sendData(self.generateDataFromSeed(data));
					}, self.timeout);
				});
			});
		},
		generateDataFromSeed: function(vectors) {
			var self = this;
			if (!vectors) {
				vectors = this.generateSeed();
			}
			// Make the vector grow or shrink
			growOrShrinkVectors(vectors, [newRandomPoint(this.width, this.height)]);
			return vectors.map(function(vector) {
				growOrShrinkVectors(vector, newRandomPoint(self.width, self.height));
				return vector.map(function(point) {
					return changePointByDelta(point, options.jump);
				});
			});
		},
		/**
		 * Generate array of vectors of points similar to the output of OpenCV edge detection
		 * 
		 * @param  {Object} options Optiona parameters to geenerate data shapes
		 * @return {Array}         
		 */
		generateSeed: function() {
			var data = [];
			var vector;
			var length;
			var previousPoint;
			var i, p;
			for (i = 0; i < options.vectorCount; i++) {
				vector = [];
				length = (Math.random() * options.vectorMeanLength / 4) + options.vectorMeanLength / 1.5;
				previousPoint = newRandomPoint(this.width, this.height);
				for (p = 0; p < length; p++) {
					previousPoint = changePointByDelta(previousPoint, options.jump);
					vector.push(previousPoint);
				}
				this.debug("built vector " + i, vector);
				data.push(vector);
			}
			return data;
		}
	};
};

module.exports = MockClient;
