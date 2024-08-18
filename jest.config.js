const { readFileSync } = require('fs');

// Read the SWC config from the main .swcrc file
const swcConfig = JSON.parse(readFileSync(`${__dirname}/.swcrc`, 'utf8'));

// This property is just for editor support and is not used by SWC
// Not removing it will cause an error
delete swcConfig.$schema;

// Add the experimental Jest workaround plugin
// This is Jest specific, so it's not in the main config
swcConfig.jsc.experimental ??= {};
swcConfig.jsc.experimental.plugins ??= [];
// swcConfig.jsc.experimental.plugins.push(['jest_workaround', {}]);

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/global-setup.ts'],
  workerIdleMemoryLimit: '1000MB',
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest', swcConfig],
  },
  testTimeout: Number(process.env.TESTS_TIMEOUT) ?? 20000,
  roots: ['tests/unit'],
  collectCoverageFrom: ['app/**/*.ts'],
  coverageThreshold: {
    global: {
      statements: 72,
      branches: 62,
      lines: 71,
      functions: 80,
    },
  },
  coverageReporters: ['json-summary', 'lcov'],
  // runtime: '@side/jest-runtime',
  reporters: [
    ['jest-silent-reporter', { useDots: true }, { showWarnings: true }],
    ['jest-junit', { outputName: 'test-results.xml' }],
    'summary',
  ],
  moduleNameMapper: {
    'next-auth/providers/credentials':
      '<rootDir>/tests/helpers/mocks/credentials.ts',
    'next-auth': '<rootDir>/tests/helpers/mocks/next-auth.ts',
    'next/navigation': '<rootDir>/tests/helpers/mocks/navigation.ts',
    'next/cache': '<rootDir>/tests/helpers/mocks/cache.ts',
  },
};
