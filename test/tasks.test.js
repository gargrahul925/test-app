const request = require("supertest");

const req = request('http://localhost:3000');

describe('tasks', () => {
    const user = {
        email: `${parseInt(Math.random() * 1000000)}@test.com`,
        password: 'test',
        name: 'test'
    };

    beforeAll(async () => {
        const response = await req.post("/users/register").send(user);
        user.token = response.body.token;
    });

    describe("POST: /tasks ", () => {

        const task = {
            title: 'test',
            description: 'attempting for test',
        };

        test("It should return id on task creation", async () => {
            const response = await req.post("/tasks")
                .set('authorization', user.token)
                .send(task);
            expect(response.statusCode).toBe(200);
            expect(response.body.data._id).toBeDefined();
        });

        test("It should return 401 if access token is provided", async () => {
            const response = await req.post("/tasks")
                .send(task);
            expect(response.statusCode).toBe(401);
        });

        test("It should return error if request payload is not valid", async () => {
            const response = await req.post("/tasks")
                .set('Authorization', user.token)
                .send({
                    description: 'hello test',
                });
            expect(response.statusCode).toBe(400);
        });

    });

    describe("PUT: /tasks/:id ", () => {
        let task = null;

        beforeAll(async () => {
            const result = await req.post("/tasks")
                .set('authorization', user.token)
                .send({
                    title: 'test',
                    description: 'attempting for test',
                });
            task = result.body.data;
        });

        test("It should return message on successful updation", async () => {
            const response = await req.put(`/tasks/${task._id}`)
                .set('authorization', user.token)
                .send({ title: 'new title' });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBeDefined();
        });

        test("It should return 401 if access token is provided", async () => {
            const response = await req.put(`/tasks/${task._id}`)
                .send(task);
            expect(response.statusCode).toBe(401);
        });

        test("It should return error if request payload is not valid", async () => {
            const response = await req.put(`/tasks/${task._id}`)
                .set('Authorization', user.token)
                .send({
                    description: 'hello test',
                });
            expect(response.statusCode).toBe(400);
        });

        xtest("It should return error if invalid task id is provided ", async () => {
            const response = await req.put(`/tasks/1234`)
                .set('Authorization', user.token)
                .send({ title: 'new title' });
            console.log(response.error)
            expect(response.statusCode).toBe(404);
        });

    });

    describe("DELETE: /tasks/:id ", () => {

        let task = null;

        beforeAll(async () => {
            const result = await req.post("/tasks")
                .set('authorization', user.token)
                .send({
                    title: 'test',
                    description: 'attempting for test',
                });
            task = result.body.data;
        });

        test("It should return message on successful deletion", async () => {
            const response = await req.delete(`/tasks/${task._id}`)
                .set('authorization', user.token)
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBeDefined();
        });

        test("It should return 401 if access token is provided", async () => {
            const response = await req.delete(`/tasks/${task._id}`)
                .send(task);
            expect(response.statusCode).toBe(401);
        });

        xtest("It should return error if invalid task id is provided ", async () => {
            const response = await req.delete(`/tasks/1234`)
                .set('Authorization', user.token)
                .send();
            console.log(response.error)
            expect(response.statusCode).toBe(404);
        });
    });

    describe("GET: /tasks/:id ", () => {
        let task = null;

        beforeAll(async () => {
            const result = await req.post("/tasks")
                .set('authorization', user.token)
                .send({
                    title: 'test',
                    description: 'attempting for test',
                });
            task = result.body.data;
        });

        test("It should return message on successful retrival", async () => {
            const response = await req.get(`/tasks/${task._id}`)
                .set('authorization', user.token)
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toBeDefined();
        });

        test("It should return 401 if access token is provided", async () => {
            const response = await req.get(`/tasks/${task._id}`)
                .send(task);
            expect(response.statusCode).toBe(401);
        });

        xtest("It should return error if invalid task id is provided ", async () => {
            const response = await req.get(`/tasks/1234`)
                .set('Authorization', user.token)
                .send();
            console.log(response.error)
            expect(response.statusCode).toBe(404);
        });


    });

    describe("GET: /tasks ", () => {
        let task = null;

        beforeAll(async () => {
            const result = await req.post("/tasks")
                .set('authorization', user.token)
                .send({
                    title: 'test',
                    description: 'attempting for test',
                });
            task = result.body.data;
        });

        test("It should return message on successful retrival", async () => {
            const response = await req.get('/tasks')
                .set('authorization', user.token)
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toBeDefined();
        });

        test("It should return 401 if access token is provided", async () => {
            const response = await req.get('/tasks')
                .send(task);
            expect(response.statusCode).toBe(401);
        });
    });

    afterAll(async () => {
        //TODO: Db can be cleaned
    });
})

