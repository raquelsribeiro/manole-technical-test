import request from "supertest";
import { app } from "../app";

describe("Health check", () => {
  it("should return healthy status on root route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "healthy",
    });
  });

  it("should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "healthy",
    });
  });
});
