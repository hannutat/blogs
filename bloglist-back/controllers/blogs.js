const router = require("express").Router();
const { request } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("express-async-errors");

router.get('/', async (request, response) => {
  
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    
  response.status(200).json(blogs);
})
  
router.post('/', async (request, response, next) => {
    let blog = request.body;
    let blogUser = request.user;
    
    if (!blog.title || !blog.url) {
      return response.status(400).json( {
        error: "Title or url missing"
      })
    }

    if (!blog.likes) {
      blog.likes = 0;
    }

    blog.user = blogUser._id;
    blog.author = blogUser.name;

    const blogDoc = new Blog(blog);
    const responseBlog = await blogDoc.save();
    
    blogUser.blogs = blogUser.blogs.concat(responseBlog._id);
    await blogUser.save();
    
    response.status(201).json(responseBlog);
})

router.delete("/:id", async (request, response, next) => {
    const id = request.params.id;

    let blogUser = request.user;
    
    let blogToDelete = await Blog.findOne( {"_id": id} );

    if (blogUser._id.toString() === blogToDelete.user.toString()) {
      blogUser.blogs = blogUser.blogs.filter(blog => blog._id.toString() != blogToDelete._id);
      await blogUser.save();
      await blogToDelete.remove();
      return response.status(204).end();
    }

    return response.status(401).json({
      error: "user mismatch"
    });
})

router.put("/:id", async (request, response) => {
    const id = request.params.id;
    const updatedObject = request.body;

    const res = await Blog.findOneAndUpdate( {"_id": id}, updatedObject, { new: true } );

    if (res) {
      return response.status(200).json(res);
    } else {
      return response.status(404).end();
    }
})

module.exports = router;