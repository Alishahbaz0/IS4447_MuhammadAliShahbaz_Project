module.exports = {
    preset: 'jest-expo',
    modulePaths: ['<rootDir>'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};
