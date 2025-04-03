import { getTestServer, teardownTestServer } from "../test-setup.js";
import User from "../../src/user/user.schema.js";
import request from "supertest";

describe("Auth Controller", () => {
  let testUserData;
  let testServer;
  let authToken;
  const userNumber = Date.now();

  beforeAll(async () => {
    testServer = await getTestServer();

    testUserData = {
      username: `testeUser-${userNumber}`,
      email: `testeuser-${userNumber}@teste.com`,
      password: "teste123",
    };

    await request(testServer).post("/auth/register").send(testUserData);

    const loginResponse = await request(testServer).post("/auth/login").send({
      email: testUserData.email,
      password: testUserData.password,
    });

    authToken = loginResponse.body.token;
  });
  afterAll(async () => {
    await teardownTestServer();
  });

  describe("GET /users", () => {
    it("Deve retornar uma lista de usuários", async () => {
      const response = await request(testServer)
        .get("/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
