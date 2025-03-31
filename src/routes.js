import { Router } from "express";
import bookController from "./books/book.controller.js";
import { verifyToken } from "./auth/verify.middleware.js";
import userController from "./user/user.controller.js";

const routes = Router();

routes.post("/books", bookController.create);
routes.get("/books", bookController.find);
routes.get("/books/:title", bookController.findByTitle);
routes.get("/books/isbn/:isbn", bookController.findByISBN);
routes.put("/books/:id", bookController.update);
routes.delete("/books/:id", bookController.delete);

routes.get("/users", verifyToken, userController.findAll);
routes.get("/users/:id", verifyToken, userController.findById);
routes.get("/users/email/:email", verifyToken, userController.findByEmail);
routes.put("/users/:id", verifyToken, userController.update);
routes.delete("/users/:id", verifyToken, userController.delete);

export { routes };
