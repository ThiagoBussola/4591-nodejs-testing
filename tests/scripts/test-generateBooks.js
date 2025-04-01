import { test } from "node:test";
import assert from "node:assert";
import fs from "fs/promises";
import { appendFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateBooksToNDJSON } from "../../scripts/generateBooks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

test("Deve gerar o número correto de livros", async () => {
  const testFilePath = path.join(__dirname, "test-books.ndjson");
  const numberOfBooks = 100;

  await cleanupFile(testFilePath);
  await generateBooksToNDJSON(testFilePath, numberOfBooks);

  const content = await fs.readFile(testFilePath, "utf-8");
  const lines = content.trim().split("\n");

  assert.strictEqual(
    lines.length,
    numberOfBooks,
    `Deveria gerar ${numberOfBooks} livros`
  );

  //await cleanupFile(testFilePath);
});
