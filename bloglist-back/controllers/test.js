const router = require("express").Router();
const { request } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
require("express-async-errors");

router.post('/reset', async (request, response, next) => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    response.status(204).end();
})

module.exports = router;