'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const weather = require('../index.js');

chai.use(chaiAsPromised);
chai.should();

describe('Weather', () => {
  it('should get the weather', () => {
    return weather([]).should.be.fulfilled.then(res => {
      res.data.should.be.an.instanceOf(Object);
    });
  });
});
