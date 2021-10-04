const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (request, response) => {
    const body = request.body;

    const userFromDb = await User.findOne( { username: body.username } );

    if (!userFromDb) {
        return response.status(401).json({
            error: "invalid user"
        });
    }

    const pwResult = await bcrypt.compare(body.password, userFromDb.passwordHash);

    if (!pwResult) {
        return response.status(401).json({
            error: "invalid user or pass"
        });
    }
    
    const user = {
        user: userFromDb.username,
        id: userFromDb._id
    }

    const token = jwt.sign(user, process.env.TOKENKEY, { expiresIn: "1h" });

    response.status(200).send( { token, username: userFromDb.username, name: userFromDb.name } );
})

module.exports = router;