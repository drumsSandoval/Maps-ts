import axios from 'axios';

const searchAPI = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  params: {
    limit: 10,
    language: 'es',
    access_token:
      'pk.eyJ1IjoiZHJ1bXNzYW5kIiwiYSI6ImNsMzEyc3NjbjA1bnkzcWxjbDM1cGU5MngifQ.zcTSV_7Plxwm3wN9ZxNsfA',
  },
});

export default searchAPI;
