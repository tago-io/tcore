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
  plugins: ["@typescript-eslint", "import", "jest"],
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "eslint:recommended"
  ],
  rules: {
    "import/order": 1
  },
};
