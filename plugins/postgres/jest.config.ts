export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)test)\\.ts?$",
  testPathIgnorePatterns: ["node_modules/", "build/"],
};
