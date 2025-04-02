import app from "../src/app.js";
import mongoose from "mongoose";

let testServer;
let isServerReady = false;

const setupTestServer = async () => {
  if (!isServerReady) {
    testServer = app.listen(0);
    testServer.on("listening", () => {
      console.log(`Test server started on port ${testServer.address().port}`);
      isServerReady = true;
    });

    await mongoose.connection.dropDatabase();
  }
  return testServer;
};

const teardownTestServer = async () => {
  if (testServer) {
      testServer.close(() => {
      console.log("Test server stopped");
      isServerReady = false;
    });
    await mongoose.connection.close();
  }
};

export const getTestServer = async () => {
  if (!isServerReady) {
    await setupTestServer();
  }
  return app; 
};

export { setupTestServer, teardownTestServer };
