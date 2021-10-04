const User = require("../models/user");
const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
    if (error.name === "ValidationError") {
        return response.status(400).json( { error: "username must be unique" } );
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json( { error: "bad token" } );
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json( { error: "token expired" } );
    }

    next(error);
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get("authorization");

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        request.token = auth.substring(7);
    }
    
    next();
}

const userExtractor = async (request, response, next) => {

    if (request.token) {
        const tokenRes = jwt.verify(request.token, process.env.TOKENKEY);
        const user = await User.findById(tokenRes.id);
        request.user = user;
    } 

    next();
}

module.exports = { errorHandler, tokenExtractor, userExtractor };