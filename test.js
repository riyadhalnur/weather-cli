'use strict';

var ava = require('ava');
var weather = require('./');

ava('Weather', function (t) {
	weather([], function (err, result) {
		t.assert(!err, err);
		t.assert(result, result);
		t.end();
	});
});
