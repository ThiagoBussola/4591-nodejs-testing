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
});
