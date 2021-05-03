require('jest-fetch-mock').enableMocks()
const fs = require('fs')

global.__global = {
  env : {
    isProd: false,
    ...require('dotenv').config().parsed
  }
}

fetchMock.mockIf("https://flsshygn-lageso-berlin-prediction-merge-dev.s3.eu-central-1.amazonaws.com/app/data.csv", req => {
  return {
    status: 200,
    body: fs.readFileSync('./data/data.csv', 'utf8'),
  }
})

fetchMock.mockIf("http://localhost/assets/data/new_build.csv", req => {
  return {
    status: 200,
    body: fs.readFileSync('./data/new_build.csv', 'utf8'),
  }
})

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
