module.exports = {
  testEnvironment: "node",
  roots: ["src"],
  bail: 1,
  collectCoverageFrom: ["src/**/*.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@src/(.*)\\.js$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  globalSetup: "<rootDir>/src/test/setup.ts",
  globalTeardown: "<rootDir>/src/test/teardown.ts",
};
