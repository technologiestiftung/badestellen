const fetchMock = require('fetch-mock')
fetchMock.config.sendAsJson = false

const fs = require('fs')

global.__global = {
  env: {
    URL: 'http://localhost:5000',
    isProd: false
    // ...require('dotenv').config().parsed
  }
}

fetchMock.get(
  'http://localhost:5000/.netlify/functions/swimapi',
  fs.readFileSync(__dirname + '/src/__tests__/data/data.json', 'utf8')
)

fetchMock.get(
  'http://localhost:5000/assets/data/new_build.csv',
  fs.readFileSync(__dirname + '/src/__tests__/data/new_build.csv', 'utf8')
)

jest.mock('mapbox-gl/dist/mapbox-gl', () => {
  return {
    default: {
      accessToken: '',
      GeolocateControl: jest.fn(),
      Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn(),
        fitBounds: jest.fn(),
        flyTo: jest.fn()
      })),
      NavigationControl: jest.fn(),
      Marker: jest.fn(() => ({
        setLngLat: jest.fn(),
        addTo: jest.fn()
      }))
    }
  }
})
