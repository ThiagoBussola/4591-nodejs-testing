import app from "./app.js";

function main() {
  app.listen(3001, "localhost", () => {
    console.log("Server running at port 3000");
  });
}

main();
