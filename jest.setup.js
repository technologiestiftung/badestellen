const fetchMock = require('fetch-mock');
fetchMock.config.sendAsJson = false;

const fs = require('fs')

global.__global = {
  env : {
    isProd: false,
    ...require('dotenv').config().parsed
  }
}

fetchMock.get(
  'https://flsshygn-lageso-berlin-prediction-merge-dev.s3.eu-central-1.amazonaws.com/app/data.csv',
  fs.readFileSync(__dirname + '/src/__tests__/data/data.csv', 'utf8')
  )

fetchMock.get(
  'http://localhost:5000/assets/data/new_build.csv',
  fs.readFileSync(__dirname + '/src/__tests__/data/new_build.csv', 'utf8')
  )
  
jest.mock('mapbox-gl/dist/mapbox-gl', () => {
  return {
    'default': {
      accessToken: '',
      GeolocateControl: jest.fn(),
      Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn(),
        fitBounds: jest.fn(),
        flyTo: jest.fn(),
      })),
      NavigationControl: jest.fn(),
      Marker: jest.fn(() => ({
        setLngLat: jest.fn(),
        addTo: jest.fn(),
      })),
    }
  }
});
