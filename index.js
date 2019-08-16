'use strict';

const axios = require('axios');
const Conf =require('conf');

const API_URL = 'https://micro-weather.now.sh';
const config = new Conf();

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
  }
};
