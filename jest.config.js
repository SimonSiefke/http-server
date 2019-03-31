module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/src/.*\\.spec\\.ts$', // all files in the src folder that end with .test.ts
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
}
