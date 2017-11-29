'use strict';

const axios = require('axios');
const API_URL = 'https://micro-weather.now.sh';

module.exports = (opts) => {
  let city = opts[0] || 'Dhaka';
  let country = opts[1] || 'Bangladesh';

  return axios.get(`${API_URL}?city=${city}&country=${country}`);
};
