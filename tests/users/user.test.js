import { beforeAll, describe, it, expect } from "@jest/globals";
import { getTestServer, teardownTestServer } from "../test-setup.js";
import User from "../../src/user/user.schema.js";
import request from "supertest";
import { errorMessages } from "../../src/enums/errorMessages.enum.js";

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

  describe("GET /users/:id", () => {
    it("Deve retornar um usuário por id", async () => {
      const user = await User.findOne({ username: testUserData.username });

      const response = await request(testServer)
        .get(`/users/${user._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(user.username);
    });

    it("Deve retornar um erro 404 se o usuário não for encontrado", async () => {
      const response = await request(testServer)
        .get(`/users/67ed738320dffdc37c2abc0a`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /users/email/:email", () => {
    it("Deve retornar um usuário por email", async () => {
      const response = await request(testServer)
        .get(`/users/email/${testUserData.email}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUserData.email);
    });

    it("Deve retornar um erro 404 se o usuário não for encontrado", async () => {
      const response = await request(testServer)
        .get(`/users/email/naoexiste@teste.com`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessages.USER_NOT_FOUND);
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

    it("Deve retornar um erro 404 se o usuário não for encontrado", async () => {
      const response = await request(testServer)
        .put(`/users/67ed738320dffdc37c2abc0a`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: "updatedUser" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessages.USER_NOT_FOUND);
    });
  });

  describe("DELETE /users/:id", () => {
    it("Deve deletar um usuário", async () => {
      const response = await request(testServer)
        .delete(`/users/${userToUpdateId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it("Deve retornar um erro 404 se o usuário não for encontrado", async () => {
      const response = await request(testServer)
        .delete(`/users/67ed738320dffdc37c2abc0a`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(errorMessages.USER_NOT_FOUND);
    });
  });
});
