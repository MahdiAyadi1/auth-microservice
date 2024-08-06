import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL as string);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth Controller", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty(
        "email",
        "john.doe@example.com"
      );
    });

    it("should not register a user with an existing email", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email already in use");
    });
  });

  describe("POST /auth/login", () => {
    it("should login an existing user", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "wrong password");
    });

    it("should not login a non-existing user", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "non.existing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
  });

  describe("GET /auth/validate-token", () => {
    it("should validate a valid token", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      const token = loginResponse.body.accessToken;

      const response = await request(app)
        .get("/auth/validate-token")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("valid", true);
    });

    it("should not validate an invalid token", async () => {
      const response = await request(app)
        .get("/auth/validate-token")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("valid", false);
    });
  });

  describe("POST /auth/refresh-token", () => {
    it("should refresh the token", async () => {
      const loginResponse = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await request(app)
        .post("/auth/refresh-token")
        .send({ token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should not refresh with an invalid token", async () => {
      const response = await request(app)
        .post("/auth/refresh-token")
        .send({ token: "invalidtoken" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid refresh token");
    });
  });
});
