const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  apiKey: process.env.MAPQUEST_API_KEY,
  formatter: null
};
geocoder = NodeGeocoder(options);

module.exports = geocoder;