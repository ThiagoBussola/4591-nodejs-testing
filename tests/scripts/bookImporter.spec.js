import mongoose from "mongoose";
import mocha from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import fs from "fs";
import BookModel from "../../src/books/book.schema.js";
import { generateBooksToNDJSON } from "../../scripts/generateBooks.js";
import { importBooksFromNDJSON } from "../../scripts/populateBooks.js";

const { describe, it, before, after, beforeEach, afterEach } = mocha;

describe("Book Importer", function () {
  const mainFilePath = "test-books.ndjson";
  const smallFilePath = "test-small-books.ndjson";
  const mainNumberOfBooks = 100000;
  const smallNumberOfBooks = 100;

  const batchSize = 1000;
  const expectBatches = Math.ceil(mainNumberOfBooks / batchSize);

  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/books_test");
    await mongoose.connection.asPromise();
    await generateBooksToNDJSON(mainFilePath, mainNumberOfBooks);
  });

  after(async () => {
    await mongoose.connection.close();
    console.log("Conexão com o mongoDB Fechada");
  });

  beforeEach(async () => {
    await BookModel.deleteMany();
  });

  afterEach(() => {
    if (fs.existsSync(smallFilePath)) fs.unlinkSync(smallFilePath);
    if (fs.existsSync(mainFilePath)) fs.unlinkSync(mainFilePath);
  });
});
