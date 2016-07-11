'use strict';

const chai = require('chai');
chai.should();

const weather = require('../index.js');

describe('Weather', () => {
	it('should get the weather', (done) => {
		weather([], (err, result) => {
			result.should.exist;
			done();
		});
	});
});
