const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("express-async-errors");

router.get('/', async (request, response) => {
  const res = await User.find({}).populate("blogs");
  
  const pwRemovedRes = res.map( result => { 
      return { username: result.username, name: result.name, blogs: result.blogs, id: result.id }
  })

  response.status(200).json(pwRemovedRes);
})
  
router.post('/', async (request, response, next) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response.status(400).json(
      { error: "username or password missing" }
    );
  }

  if (body.username.length < 3 || body.password.length < 3 ) {
    return response.status(400).json(
      { error: "username or password too short" }
    );
  }

  const pwHash = await bcrypt.hash(body.password, 10);

  const user = new User( { username: body.username,
                            passwordHash: pwHash,
                            name: body.name } );

  const savedUser = await user.save();
  response.status(201).json(savedUser);
})

module.exports = router;