module.exports = {
  "transform": {
    "^.+\\.(js|mjs)$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": true
      }
    ]    
  },
  "moduleFileExtensions": [
    "js",
    "mjs",
    "ts",
    "svelte"
  ],
  "coverageDirectory": ".coverage",
  "coverageReporters": ["json", "lcov", "text", "clover", "html"],
  "collectCoverageFrom": [
    "src/**/*.js",
    "src/**/*.svelte",
    "src/**/*.ts"
  ],
  "coverageProvider": "babel",
  "coveragePathIgnorePatterns": [
    ".*\\.d\\.ts",
    "main.ts"
  ],
  transformIgnorePatterns: [
    ignoreModules([
      'svelte-spa-router',
      'regexparam',
      'svelte-scrollto'
    ])
  ],
  moduleNameMapper: {
    "^regexparam$": "<rootDir>/node_modules/regexparam/dist/regexparam.mjs",
  },
  "bail": 1,
  "verbose": true,
  "setupFiles": ["./jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};

function ignoreModules(modules) {
  return `node_modules/(?!(${modules.join('|')})/)`
}