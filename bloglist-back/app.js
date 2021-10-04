const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
require("express-async-errors");
const { errorHandler, tokenExtractor, userExtractor } = require("./utils/middleware");

const app = express();

app.use(cors());

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch (error => console.log(error))

app.use(express.json());
app.use(express.static("build"));
app.use("/api/blogs", tokenExtractor, userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
        const testRouter = require("./controllers/test");
        app.use("/api/test", testRouter);
}

app.use(errorHandler);

module.exports = app;