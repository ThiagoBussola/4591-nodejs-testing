import { beforeAll, describe, it, expect } from "@jest/globals";
import { getTestServer, teardownTestServer } from "../test-setup.js";
import User from "../../src/user/user.schema.js";
import request from "supertest";

describe("Auth Controller", () => {
  let testUserData;
  let testServer;
  let authToken;
  let userToUpdateId;
  const userNumber = Date.now();

  beforeAll(async () => {
    testServer = await getTestServer();

    testUserData = {
      username: `testeUser-${userNumber}`,
      email: `testeuser-${userNumber}@teste.com`,
      password: "teste123",
    };

    await request(testServer).post("/auth/register").send(testUserData);

    const userToUpdate = {
      username: `usuarioUpdate`,
      email: `usuarioupdate@teste.com`,
      password: "teste1234",
    };

    const savedUser = await request(testServer)
      .post("/auth/register")
      .send(userToUpdate);

    userToUpdateId = savedUser.body.id;

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

      const countUsersOnDb = await User.countDocuments();

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(countUsersOnDb);
    });
  });

  describe("PUT /users/:id", () => {
    it("Deve atualizar um usuário por id", async () => {
      const userToUpdate = await User.findById(userToUpdateId);

      const response = await request(testServer)
        .put(`/users/${userToUpdate._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: "updatedUser" });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("updatedUser");
    });
  });
});
