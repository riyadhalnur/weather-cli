'use strict';

const axios = require('axios');
const Conf = require('conf');

const API_URL = 'https://micro-weather.now.sh';
const schema = require('./schema');
const config = new Conf({
  projectName: 'weather-cli',
  schema
});

const _toFahrenheit = temp => Math.round((9 / 5) * temp + 32);

module.exports = {
  getWeather: (flags) => {
    return new Promise((resolve, reject) => {
      let city = flags.city || config.get('city');
      let country = flags.country || config.get('country');

      if (!city || !country) {
        return reject(new Error('Country and/or city missing!'));
      }

      axios.get(`${API_URL}?city=${city}&country=${country}`)
        .then(res => {
          let result = Object.assign(res.data, { city: city, country: country, scale: flags.scale });

          if (flags.scale === 'F' || config.get('scale') === 'F') {
            result.temp = _toFahrenheit(res.data.temp);
            result.scale = 'F';
          }

          resolve(result);
        })
        .catch(err => reject(err));
    });
  },
  setLocation: (opts) => {
    return new Promise((resolve, reject) => {
      if (!opts.city || !opts.country) {
        return reject(new Error('Invalid and/or missing arguments!'));
      }

      config.set('city', opts.city);
      config.set('country', opts.country);

      if (opts.scale) {
        config.set('scale', opts.scale.toUpperCase());
      }

      resolve(`Default location set to ${opts.city}, ${opts.country} and scale to ${opts.scale ? opts.scale : 'C'}`);
    });
  },
  mapAQI: (aqi) => {
    if (aqi >= 0 && aqi <= 50) {
      return 'Good';
    } else if (aqi >= 51 && aqi <= 100) {
      return 'Moderate';
    } else if (aqi >= 101 && aqi <= 150) {
      return 'Unhealthy for sensitive groups';
    } else if (aqi >= 151 && aqi <= 200) {
      return 'Unhealthy';
    } else if (aqi >= 201 && aqi <= 300) {
      return 'Very Unhealthy';
    } else if (aqi > 300) {
      return 'Hazardous';
    }
  }
};
