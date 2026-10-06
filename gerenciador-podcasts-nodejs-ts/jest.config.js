/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  restoreMocks: true,
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};
