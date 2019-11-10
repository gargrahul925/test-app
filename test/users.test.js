const request = require("supertest");

const req = request('http://localhost:3000');

describe('users', () => {

    describe("POST: /users/register ", () => {
        const user = {
            email: `${parseInt(Math.random() * 1000000)}@test.com`,
            password: 'test',
            name: 'test'
        };
        test("It should return token on successful registration", async () => {
            const response = await req.post("/users/register").send(user);
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        test("It should return error if request body is not valid", async () => {
            const response = await req.post("/users/register").send({
                email: `${parseInt(Math.random() * 1000000)}@test.com`,
                password: 'test',
            });
            expect(response.statusCode).toBe(400);
        });

        test("It should return error if user is already registed", async () => {
            const response = await req.post("/users/register").send({
                email: user.email,
                password: 'test',
                name: 'test'
            });
            expect(response.statusCode).toBe(409);
        });
    });

    describe("POST: /users/login ", () => {
        const user = {
            email: `${parseInt(Math.random() * 1000000)}@test.com`,
            password: 'test',
            name: 'test'
        };
        beforeAll(async () => {
            await req.post("/users/register").send(user);
        });
        test("It should return token on successful registration", async () => {
            const response = await req.post("/users/login").send({
                email: user.email,
                password: user.password,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        test("It should return 401 if password is wrong", async () => {
            const response = await req.post("/users/login").send({
                email: user.email,
                password: 'teeee',
            });
            expect(response.statusCode).toBe(401);
        });

        test("It should return 400 id password given", async () => {
            const response = await req.post("/users/login").send({
                email: user.email,
            });
            expect(response.statusCode).toBe(400);
        });
    });

    afterAll(async () => {
        //TODO: Db can be cleaned
    });
});