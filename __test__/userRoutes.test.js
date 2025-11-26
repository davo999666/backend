import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from "supertest";
import { createServer } from '../server.js';
import { User } from "../models/index.js";
import { createHash } from "../utils/createHash.js";
import { sequelize } from "../models/index.js"; // import your Sequelize instance
import { cache } from "../cashe/cashe.js";

// Mock sendEmail
jest.mock("../utils/sendEmail.js", () => ({
    sendEmail: jest.fn().mockResolvedValue(true)
}));

let app;
let server;

describe("User endpoints integration", () => {
    let testUser;
    const testEmail = "testuser@example.com";

    beforeAll(async () => {
        jest.setTimeout(30000); // longer timeout for DB

        const result = createServer();
        app = result.app;       // Express app for supertest
        server = result.server; // HTTP server for closing after tests

        await User.destroy({ where: { login: "testUser" } });

        const password_hash = await createHash("1234");
        testUser = await User.create({
            login: "testUser",
            fullName: "Test User",
            email: testEmail,
            phone: "0000000000",
            role: "user",
            password_hash
        });
    });

    afterAll(async () => {
        // Cleanup user
        await User.destroy({ where: { login: "testUser" } });
        // Close server properly
        if (server) {
            await new Promise(resolve => server.close(resolve));
        }
        // Close DB connection
        await sequelize.close();
    });

    it("POST /users/login should return token and user data", async () => {
        const res = await request(app)
            .post("/users/login")
            .send({ login: "testUser", password: "1234" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("tokenHase");
        expect(res.body.foundUser.login).toBe("testUser");
    });

    it("POST /users/register should send verification code", async () => {
        const res = await request(app)
            .post("/users/register")
            .send({
                login: "newUser",
                fullName: "New User",
                email: "newuser@example.com",
                phone: "1111111111",
                password: "1234",
                role: "user"
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Verification code sent to email");

        const newUser = await User.findOne({ where: { login: "newUser" } });
        if (newUser) await newUser.destroy();
    });

    it("POST /users/verification should verify user", async () => {
        const code = "9999";
        cache.set(`pending:verify@example.com`, {
            login: "verifyUser",
            fullName: "Verify User",
            email: "verify@example.com",
            phone: "2222222222",
            password_hash: await createHash("1234"),
            code
        });

        const res = await request(app)
            .post("/users/verification")
            .send({ email: "verify@example.com", code });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "User verified");

        const verifiedUser = await User.findOne({ where: { login: "verifyUser" } });
        if (verifiedUser) await verifiedUser.destroy();
    });
    // it("POST /users/verification should fail if email already exists", async () => {
    //     const code = "8888";
    //
    //     // Insert user manually to DB
    //     await User.create({
    //         login: "existingUser",
    //         fullName: "Existing User",
    //         email: "existing@example.com",
    //         phone: "1234567890",
    //         password_hash: await createHash("1234"),
    //         role: "user"
    //     });
    //
    //     // Set pending verification in cache
    //     cache.set(`pending:existing@example.com`, {
    //         login: "existingUser",
    //         fullName: "Existing User",
    //         email: "existing@example.com",
    //         phone: "1234567890",
    //         password_hash: await createHash("1234"),
    //         code
    //     });
    //
    //     const res = await request(app)
    //         .post("/users/verification")
    //         .send({ email: "existing@example.com", code });
    //
    //     expect(res.status).toBe(400); // or whatever your error handler returns
    //     expect(res.body.message).toMatch(/email must be unique/);
    //
    //     const user = await User.findOne({ where: { email: "existing@example.com" } });
    //     if (user) await user.destroy();
    // });

    it("PATCH /users/reset-password should update password", async () => {
        const login = testUser.login;
        const auth = Buffer.from(`${login}:1234`).toString("base64");

        const res = await request(app)
            .patch("/users/reset-password")
            .set("Authorization", `Basic ${auth}`)
            .send({ newPassword: "5678" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Password reset successful");
    });

    it("POST /users/forgot-password/:email should send verification code", async () => {
        const res = await request(app)
            .post(`/users/forgot-password/${testEmail}`)
            .send();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Verification code sent to email");
    });
});
