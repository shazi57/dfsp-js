module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-shadow': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': 'off',
    'no-useless-catch': 'off',
    'import/no-unresolved': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'no-multi-assign': 'off',
  },
};
