import React from 'react';
import ReactDOM from 'react-dom/client';
import {PlacesProvider} from './context';
import MapsApp from './MapsApp';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken =
  'pk.eyJ1IjoiZHJ1bXNzYW5kIiwiYSI6ImNsMzEyc3NjbjA1bnkzcWxjbDM1cGU5MngifQ.zcTSV_7Plxwm3wN9ZxNsfA';

if (!navigator.geolocation) {
  alert('Tu navegador no tiene opción de Geolocation');
  throw new Error('Tu navegador no tiene opción de Geolocation');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <PlacesProvider>
      <MapsApp />
    </PlacesProvider>
  </React.StrictMode>,
);
