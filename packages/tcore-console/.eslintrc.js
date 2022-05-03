module.exports = {
  root: true,
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'jest/globals': true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaversion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'import', 'jest', 'react', 'react-hooks'],
  ignorePatterns: [
    "*.js",
    "utils/*",
    "build*",
    "index.d.ts",
  ],
  rules: {
    'no-async-promise-executor': 0,
    'arrow-parens': 0,
    'camelcase': 0,
    'class-methods-use-this': 0,
    'import/order': 'error',
    'import/extensions': 0,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-cycle': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          '@',
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'error',
    'no-template-curly-in-string': 'warn',
    'curly': 'error',
    'array-callback-return': ['error', { allowImplicit: true }],
    'block-scoped-var': 'error',
    'default-case': ['error', { commentPattern: '^no default$' }],
    'dot-notation': 'error',
    'eqeqeq': ['error', 'smart'],
    'guard-for-in': 'error',
    'no-alert': 'warn',
    'no-caller': 'error',
    'no-empty-function': 'warn',
    'no-eval': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    '@typescript-eslint/no-shadow': 'error',
    'id-denylist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'react/prop-types': 0,
    "react/jsx-uses-react": "off", // new JSX Transformation
    "react/react-in-jsx-scope": "off", // new JSX Transformation
    "react/display-name": "off",
  },
  overrides: [
    // Let TypeScript do its own checks for no-undef, see FAQ.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'no-undef': 'off',
      }
    }
  ]
};
