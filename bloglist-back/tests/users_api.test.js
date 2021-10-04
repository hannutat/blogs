const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

const users = [
    {
        username: "pera",
        name: "Pertti Kekäläinen",
        password: "xyz123"
    },
    {
        username: "master",
        name: "Testimestari",
        password: "qwerty"
    }
  ];

beforeEach( async () => {
    await User.deleteMany({});
    let userDocs = [];
    users[0].passwordHash = await bcrypt.hash(users[0].password, 10);
    users[1].passwordHash = await bcrypt.hash(users[1].password, 10);

    users.forEach( (user) => {
        const newUser = new User(user);
        userDocs.push(newUser);
    });
    await User.insertMany(userDocs);
});

afterAll( () => {
    mongoose.connection.close();
})

describe("Users API tests", () => {

    test("existing user cannot be added again, response is correct", async () => {
        let response = await api.post("/api/users").send(users[0]);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual( { error: "username must be unique"} );

        response = await api.get("/api/users");

        expect(response.body.length).toBe(users.length);
    })

    test("user with missing or invalid username will not be created", async () => {
        let newUser = { username: "kk", name: "Kepa", password: "supersalainen" };

        let response = await api.post("/api/users").send(newUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual( { error: "username or password too short"} );
        
        newUser = { username: "", name: "Kepa", password: "supersalainen" };
        response = await api.post("/api/users").send(newUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual( { error: "username or password missing"} );

        response = await api.get("/api/users");
        expect(response.body.length).toBe(users.length);
    })


    test("user with missing or invalid password will not be created", async () => {
        let newUser = { username: "keke", name: "Kepa", password: "su" };

        let response = await api.post("/api/users").send(newUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual( { error: "username or password too short"} );
        
        newUser = { username: "keke", name: "Kepa", password: "" };
        response = await api.post("/api/users").send(newUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual( { error: "username or password missing"} );

        response = await api.get("/api/users");
        expect(response.body.length).toBe(users.length);
    })

})

