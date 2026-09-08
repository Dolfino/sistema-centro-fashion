// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: [
    'dist/',
    'backend/dist/',
    'backend/node_modules/',
    'legacy_gas_code/',
    'database/',
    'scripts/',
    'android/',
    '.expo/',
  ],
};
