const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

let token;
let testUserId;

const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  
  ];

beforeEach( async () => {
    const testUser = {
        username: "master",
        name: "Testimestari",
        password: "qwerty"
    }

    await User.deleteMany({});
    testUser.passwordHash = await bcrypt.hash(testUser.password, 10);
    const newTestUser = new User(testUser);
    testUserId = await (await newTestUser.save())._id;

    await Blog.deleteMany({});
    let blogDocs = [];
    let blogIds = [];

    blogs.forEach( blog => {
        blog.user = testUserId;
        let newBlog = new Blog(blog);
        blogDocs.push(newBlog);
    });

    const insertRes = await Blog.insertMany(blogDocs);

    insertRes.forEach(res => blogIds.push(res._id));

    await User.findByIdAndUpdate( {_id: testUserId}, { blogs: blogIds });

    const loginRes = await api.post("/api/login").send( {username: "master", password: "qwerty"} );
    token = loginRes.body.token;
});

afterAll( () => {
    mongoose.connection.close();
})

describe("Blogs API tests", () => {

    test("fetch all blogs, status and content type", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    })

    test("fetch all blogs, correct amount", async () => {
        const response = await api.get("/api/blogs");

        expect(response.body).toHaveLength(blogs.length);
    })

    test("field id exists in returned blogs", async () => {
        const response = await api.get("/api/blogs");

        response.body.forEach( blog => expect(blog.id).toBeDefined());
    })

    test("adding a blog grows total number by one", async () => {
        await api.post("/api/blogs")
                 .set( {Authorization: `bearer ${token}` } )
                 .send(blogs[0]);

        const response = await api.get("/api/blogs");

        expect(response.body).toHaveLength(blogs.length + 1);
    })

    test("blogs have all fields after adding new", async () => {
        await api.post("/api/blogs").send(blogs[0]);

        const response = await api.get("/api/blogs");

        response.body.forEach( blog => {
            expect(blog.id).toBeDefined();
            expect(blog.title).toBeDefined();
            expect(blog.url).toBeDefined();
            expect(blog.likes).toBeDefined();
        });
    })

    test("if no likes value, likes is set to 0", async () => {
        let blog = blogs[0];
        delete blog.likes;

        const response = await api.post("/api/blogs")
                                .set( {Authorization: `bearer ${token}` } )
                                .send(blog);

        expect(response.body.likes).toBe(0);
    })

    test("if new blog does not contain title, response is 400", async () => {
        let blog = blogs[0];
        delete blog.title;

        const response = await api.post("/api/blogs").send(blog);

        expect(response.statusCode).toBe(400);
    })

    test("if new blog does not contain url, response is 400", async () => {
        let blog = blogs[0];
        delete blog.url;

        const response = await api.post("/api/blogs").send(blog);

        expect(response.statusCode).toBe(400);
    })

    test("deleting a blog post that doesn't exist, response is 404", async () => {
        const response = await api.delete("/api/blogs").send("12341351421")

        expect(response.statusCode).toBe(404);
    })

    test("deleting a blog post, response is 204", async () => {
        const existingBlog = await Blog.findOne();

        const response = await api.delete(`/api/blogs/${existingBlog.id}`)
                                .set( {Authorization: `bearer ${token}` } );

        expect(response.statusCode).toBe(204);
    })

    test("deleting a blog post decreases total amount by one", async () => {
        const existingBlog = await Blog.findOne();
        await api.delete(`/api/blogs/${existingBlog.id}`)
                 .set( {Authorization: `bearer ${token}` } );

        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(blogs.length - 1);
    })

    test("updating likes, response is correct", async () => {
        const existingBlog = await Blog.findOne();

        const updatedBlog = { ...existingBlog, likes: 22 };
         
        const response = await api.put(`/api/blogs/${existingBlog.id}`).send( { likes: 22 } );

        expect(response.statusCode).toBe(200);
        expect(response.body.likes).toEqual(updatedBlog.likes);
    })

})

