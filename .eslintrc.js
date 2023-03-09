module.exports = {
  env: {
    browser: false,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-floating-promises': ['error', {
      ignoreIIFE: true
    }],
    "@typescript-eslint/restrict-template-expressions": 'off'
  }
}
