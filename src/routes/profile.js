const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");
// const { validate } = require("../models/user.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const data = req.body;
        const isEditAllowed = validateEditProfileData(data);
        if (!isEditAllowed) {
            throw new Error("Data edit not allowed!");
        }
        if (data?.skills?.length > 10) {
            throw new Error("Only 10 skills allowed");
        }

        //update skills logic
        const loggedInUser = req.user;
        Object.keys(data).forEach(key =>
            loggedInUser[key] = data[key]
        );
        await loggedInUser.save();

        res.json({
            'status': true,
            'data': loggedInUser,
            'message': `${loggedInUser?.firstName} updated successfully.`
        })
    } catch (err) {
        res.status(400).json({
            'status': false,
            'error': err.message
        });
    }
});

module.exports = profileRouter;
