import fs from "fs";
import { faker } from "@faker-js/faker";

export async function generateBooksToNDJSON(filePath, numberOfBooks) {
  const writeStream = fs.createWriteStream(filePath);

  for (let i = 0; i < numberOfBooks; i++) {
    const book = {
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      ISBN: faker.string.numeric(10),
    };
    writeStream.write(JSON.stringify(book) + "\n");
  }

  writeStream.end();
}

generateBooksToNDJSON("books.ndjson", 100000);
