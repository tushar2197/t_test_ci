export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.{js,jsx}', '**/?(*.)+(spec|test).{js,jsx}'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude server startup file
  ],
};
