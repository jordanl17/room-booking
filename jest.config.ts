export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@molecules/(.*)': '<rootDir>/src/components/molecules/$1',
    '@atoms/(.*)': '<rootDir>/src/components/atoms/$1',
    '@views/(.*)': '<rootDir>/src/components/views/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '@contexts/(.*)': '<rootDir>/src/contexts/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
}
