import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import BookModel from "../../src/books/book.schema.js";
import { getTestServer, teardownTestServer } from "../test-setup.js";
import { generateBooksToNDJSON } from "../../scripts/generateBooks.js";
import { importBooksFromNDJSON } from "../../scripts/populateBooks.js";

const numberOfBooks = 20;
const filePath = "books-integration.ndjson";
const mockBook = {
  title: "Livro de Teste",
  author: "Autor Teste",
  ISBN: Date.now().toString(),
};

describe("Book Controller", () => {
  let testServer;

  beforeAll(async () => {
    testServer = await getTestServer();

    await generateBooksToNDJSON(filePath, numberOfBooks);

    await importBooksFromNDJSON(filePath);

    const count = await BookModel.countDocuments();
    console.log("Livros no banco: ", count);
  });

  afterAll(async () => {
    await teardownTestServer();
  });

  describe("POST /books", () => {
    it("Deve criar um novo livro", async () => {
      const response = await request(testServer)
        .post("/books")
        .send(mockBook)
        .expect(201);

      expect(response.body.title).toBe(mockBook.title);
      expect(response.body.author).toBe(mockBook.author);
      expect(response.body.ISBN).toBe(mockBook.ISBN);

      const savedBook = await BookModel.findOne({ ISBN: mockBook.ISBN });
      expect(savedBook).toBeTruthy();
      expect(savedBook.title).toBe(mockBook.title);
    });

    it("Deve retornar 400 ao tentar cadastrar um livro com ISBN já existente", async () => {
      const bookData = {
        title: "Livro repetido",
        autor: "Teste da Silva",
        ISBN: mockBook.ISBN,
      };

      const response = await request(testServer)
        .post("/books")
        .send(bookData)
        .expect(400);

      expect(response.body.message).toBe("Book with this ISBN already exists");
    });
  });

  describe("GET /books", () => {
    it("Deve retornar todos os livros", async () => {
      const response = await request(testServer).get("/books").expect(200);

      const dbCount = await BookModel.countDocuments();

      expect(response.body.length).toBe(dbCount);
    });
  });

  describe("GET /books/:title", () => {
    it("Deve retornar um livro pelo título", async () => {
      const response = await request(testServer)
        .get(`/books/${mockBook.title}`)
        .expect(200);

      expect(response.body[0].title).toBe(mockBook.title);
    });

    it("Deve retornar 404 se o livro não for encontrado pela busca por titulo", async () => {
      const response = await request(testServer)
        .get("/books/Livro-Inexistente")
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("GET /books/isbn/:isbn", () => {
    it("Deve retornar um livro pelo ISBN", async () => {
      const response = await request(testServer)
        .get(`/books/isbn/${mockBook.ISBN}`)
        .expect(200);

      expect(response.body.title).toBe(mockBook.title);
    });

    it("Deve retornar 404 se o livro não for encontrado pela busca por ISBN", async () => {
      const response = await request(testServer)
        .get("/books/isbn/ISBN-Inexistente")
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("PUT /books/:id", () => {
    it("Deve atualizar um livro existente", async () => {
      const bookToUpdate = await BookModel.findOne({ ISBN: mockBook.ISBN });
      const updatedData = { title: "Novo Título" };

      const response = await request(testServer)
        .put(`/books/${bookToUpdate._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe(updatedData.title);
    });

    it("Deve retornar 404 se o livro não for encontrado para atualização", async () => {
      const response = await request(testServer)
        .put("/books/67ed738320dffdc37c2abc0a")
        .send({ title: "Novo Título" })
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });
  });

  describe("DELETE /books/:id", () => {
    it("Deve deletar um livro existente", async () => {
      const bookToDelete = await BookModel.findOne({ ISBN: mockBook.ISBN });

      await request(testServer)
        .delete(`/books/${bookToDelete._id}`)
        .expect(204);

      const deletedBook = await BookModel.findById(bookToDelete._id);
      expect(deletedBook).toBeNull();
    });

    it("Deve retornar 404 se o livro não for encontrado para remoção", async () => {
      const response = await request(testServer)
        .delete("/books/67ed738320dffdc37c2abc0a")
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });
  });
});
