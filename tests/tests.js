/* eslint-env max-nested-callbacks: ["error", 5] */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Conf = require('conf');

const schema = require('../src/schema');
const config = new Conf({
  projectName: 'weather-cli',
  schema
});
const weather = require('../src/index.js');

chai.use(chaiAsPromised);
chai.should();

describe('Weather CLI', () => {
  beforeEach(() => {
    config.clear();
  });

  describe('Retrieve', () => {
    beforeEach(() => {
      config.set('city', 'Dhaka');
      config.set('country', 'Bangladesh');
    });

    it('should get the weather for default location', () => {
      return weather.getWeather({scale: 'C', s: 'C'}).should.be.fulfilled.then(res => {
        res.should.be.an.instanceOf(Object);
        res.city.should.be.equal('Dhaka');
        res.country.should.be.equal('Bangladesh');
      });
    });

    it('should get the weather for default location and Fahrenheit scale', () => {
      return weather.getWeather({scale: 'F', s: 'F'}).should.be.fulfilled.then(res => {
        res.should.be.an.instanceOf(Object);
        res.scale.should.be.equal('F');
        res.city.should.be.equal('Dhaka');
        res.country.should.be.equal('Bangladesh');
      });
    });

    it('should get the weather for custom location', () => {
      return weather.getWeather({scale: 'C', s: 'C', city: 'Kuala Lumpur', country: 'Malaysia'}).should.be.fulfilled.then(res => {
        res.should.be.an.instanceOf(Object);
        res.city.should.be.equal('Kuala Lumpur');
        res.country.should.be.equal('Malaysia');
      });
    });
  });

  describe('Error handling', () => {
    it('should return error if no defaults set or arguments passed in', () => {
      return weather.getWeather({scale: 'C', s: 'C'}).should.be.rejected;
    });
  });

  describe('Configure defaults', () => {
    it('should print success message if config set successfully', () => {
      return weather.setLocation({city: 'Dhaka', country: 'Bangladesh'}).should.be.fulfilled.then(res => {
        res.should.equal('Default location set to Dhaka, Bangladesh and scale to C');
      });
    });

    it('should return error if arguments are missing', () => {
      return weather.setLocation({city: 'Dhaka'}).should.be.rejected;
    });

    it('should set custom location and scale', () => {
      return weather.setLocation({city: 'Dhaka', country: 'Bangladesh', scale: 'F'}).should.be.fulfilled.then(res => {
        res.should.equal('Default location set to Dhaka, Bangladesh and scale to F');
      });
    });
  });
});
