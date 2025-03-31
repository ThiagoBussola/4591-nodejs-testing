import fs from "fs";
import readline from "readline";
import mongoose from "mongoose";
import BookModel from "../src/books/book.schema.js";

export async function importBooksFromNDJSON(filePath, batchSize = 1000) {
  const fileStream = fs.createReadStream(filePath);
  fileStream.on("open", () => {
    console.log("Arquivo aberto com sucesso.");
  });

  fileStream.on("error", (error) => {
    console.error("Erro ao abrir o arquivo:", error);
  });

  fileStream.on("close", () => {
    console.log("Arquivo fechado.");
  });

  fileStream.on("end", () => {
    console.log("Leitura do arquivo concluída.");
  });
  const rl = readline.createInterface({ input: fileStream });

  rl.on("close", () => {
    console.log("Leitura do arquivo concluída pelo readline.");
  });

  rl.on("error", (error) => {
    console.error("Erro no readline:", error);
  });

  let batch = [];
  let totalBooks = 0;

  for await (const line of rl) {
    try {
      const book = JSON.parse(line);
      batch.push(book);
      totalBooks++;

      if (batch.length >= batchSize) {
        console.log(`Inserindo lote de ${batch.length} livros...`);
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
    console.log(`Inserindo último lote de ${batch.length} livros...`);
    try {
      await BookModel.insertMany(batch);
    } catch (error) {
      console.error("Erro ao inserir último lote de livros:", error);
    }
  }

  console.log(`Importação concluída! Total de livros inseridos: ${totalBooks}`);

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
