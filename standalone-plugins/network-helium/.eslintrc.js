module.exports = {
  env: {
    node: true,
    jest: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
    },
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "jsdoc"],
  ignorePatterns: ["build", "esbuild"],
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:jsdoc/recommended",
  ],
  rules: {
    "import/order": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "camelcase": ["error", { "properties": "never" }],
    "no-unused-vars": "error",
    "jsdoc/require-jsdoc": "error",
    "jsdoc/require-hyphen-before-param-description": "error",
    "jsdoc/check-indentation": "error",
    "jsdoc/require-param": 0,
    "jsdoc/require-param-type": 0,
    "prefer-arrow-callback": "error",
    "@typescript-eslint/naming-convention": ["error",
      {
        "selector": 'interface',
        "prefix": ["I"],
        "format": ["PascalCase"],
      }
    ],
  },
};
