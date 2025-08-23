const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = (token === "xyz");
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(404).send("Unauthorized access");
    }
};

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid credentials");
        }

        const decodedMessage = await jwt.verify(token, "dev@tinder.com");
        const { _id } = decodedMessage;
        if (!_id) {
            throw new Error("Invalid credentials");
        }

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = {
    adminAuth,
    userAuth
}