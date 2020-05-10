// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@rsql/(.*)$": "<rootDir>/packages/$1/dist",
  },
  globals: {
    "ts-jest": {
      tsConfig: "./tests/tsconfig.json",
    },
  },
};
