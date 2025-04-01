import fs from "fs";
import readline from "readline";
import mongoose from "mongoose";
import BookModel from "../src/books/book.schema.js";

export async function importBooksFromNDJSON(filePath, batchSize = 1000) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({ input: fileStream });

  let batch = [];

  for await (const line of rl) {
    try {
      const book = JSON.parse(line);
      batch.push(book);

      if (batch.length >= batchSize) {
        try {
          await BookModel.insertMany(batch);
        } catch (error) {
          console.error("Erro ao inserir lote de livros:", error);
        }
        batch = [];
      }
    } catch (error) {
      console.error("Erro ao parsear linha:", line, error);
    }
  }

  if (batch.length > 0) {
    try {
      await BookModel.insertMany(batch);
    } catch (error) {
      console.error("Erro ao inserir último lote de livros:", error);
    }
  }

  rl.close();
  fileStream.destroy();
}

// O script só vai ser executado se for chamado diretamente, para evitar que o teste execute o script no banco de prod
if (process.argv[1] && process.argv[1].endsWith("populateBooks.js")) {
  (async () => {
    await mongoose.connect("mongodb://localhost:27017/books");
    await importBooksFromNDJSON("books.ndjson");
    mongoose.connection.close();
  })();
}
