/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/*.test.ts',
    '**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/types.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    './src/entities/signups/service.ts': {
      branches: 66,  // Current coverage: 66.66%
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/entities/kitas/handler/locationService.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};