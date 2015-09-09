'use strict';

var YQL = require('yql');
var _ = require('lodash');

module.exports = function (opts, callback) {
	opts = opts || [];

	var query;

	if (_.isEmpty(opts)) {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Dhaka, Bangladesh")');
	} else {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + opts[0] + ', ' + opts[1] + '")');
	}

	query.exec(function (err, response) {
		if (err) {
			return callback(err);
		}

		callback(null, response);
	});
};
