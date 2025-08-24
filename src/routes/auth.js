const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req.body);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        const token = await user.getJWT();
        res.cookie("token", token,
            {
                expires: new Date(Date.now() + 3600000) // cookie will be removed after 1 hour
            }
        );

        res.send("user saved successfully");
    } catch (err) {
        res.status(400).send("Error in saving user :" + err);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        console.log('user', user);
        if (!user || user.length === 0) {
            res.send("Invalid credentials");
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            res.send("Invalid credentials");
        } else {
            const token = await user.getJWT();
            //another way
            // const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60),  _id: user._id }, "dev@tinder.com");
            res.cookie("token", token,
                {
                    expires: new Date(Date.now() + 3600000) // cookie will be removed after 1 hour
                }
            );
            res.send("successful login!");
        }
    } catch (err) {
        res.status(400).send("Error in login :" + err);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send();
});

module.exports = authRouter;
