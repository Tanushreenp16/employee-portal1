const request = require("supertest");
const app = require("../app");

describe("Auth API Tests", () => {

  test("Register user - success", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "testuser@gmail.com",
        password: "123456",
        role: "employee"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("Login user - success", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Login user - wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

});
