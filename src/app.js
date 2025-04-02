import express from "express";
import mongoose from "mongoose";
import { routes } from "./routes.js";
import authRouter from "./auth/auth.routes.js";

class App {
  constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
  }

  middleware() {
    this.express.use(express.json());
  }

  async database() {
    const isTest = process.env.NODE_ENV === "dev";

    console.log(isTest);

    const DB_NAME = isTest ? "books_test" : "books";
    const MONGO_URI = `mongodb://localhost:27017/${DB_NAME}`;
    console.log(MONGO_URI);
    try {
      await mongoose.connect(MONGO_URI);
      console.log("connect database success");
    } catch (err) {
      console.error("Fail to connect database", err);
    }
  }

  routes() {
    this.express.use(routes);
    this.express.use("/auth", authRouter);
  }
}

export default new App().express;
