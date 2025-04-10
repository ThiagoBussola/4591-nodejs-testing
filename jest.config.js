export default {
  testMatch: ["**/tests/**/*.(test).[jt]s?(x)"],
  setupFiles: ["./.jest/testEnv.js"],
  setupFilesAfterEnv: ["./tests/test-setup.js"],
  testEnvironment: "node",
  testTimeout: 30000,
  maxWorkers: 1,
  verbose: true,
  transform: {},
};
