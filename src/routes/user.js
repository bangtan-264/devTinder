const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const { connection } = require("mongoose");

const USER_SAFE_DATA = "firstName lastName age gender skills about photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        //fetch all the pending req (interested, targetUserId, source userId - name )
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            targetUserId: loggedInUser._id,
            status: "interested"
        }).populate("sourceUserId", USER_SAFE_DATA);

        if (!connectionRequest) {
            throw new Error("You don't have any pending requests yet!");
        }

        res.json({
            status: true,
            data: connectionRequest
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            error: err?.message ?? "Something went wrong. Please try again later."
        })
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { sourceUserId: loggedInUser._id, status: "accepted" },
                { targetUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("sourceUserId", USER_SAFE_DATA).populate("targetUserId", USER_SAFE_DATA);

        console.log("connections", connections);

        const connectionsData = connections.map(data => {
            if (data.targetUserId.equals(loggedInUser._id)) {
                return data.sourceUserId;
            }
            return data.targetUserId;
        });

        res.json({
            status: true,
            data: connectionsData
        });

    } catch (err) {
        res.status(400).json({
            status: false,
            error: err?.message ?? "Something went wrong. Please try again later."
        })
    }
});

//get user by email 
userRouter.get("/user", async (req, res) => {
    const userEmailId = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmailId });
        if (!user || user.length === 0) {
            res.send("User doesn't exists for the given email id.");
        } else {
            res.send("User : " + user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

//Feed api - get all users data 
userRouter.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("Something went wrong.");
        } else {
            res.send("Users : " + users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

//delete user by id 
userRouter.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const userDelete = await User.findByIdAndDelete(userId);
        if (userDelete.length === 0) {
            res.status(404).send('Something went wrong.');
        } else {
            res.send('User deleted successfully');
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

userRouter.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    const options = {
        returnDocument: 'before'
    };
    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "phototUrl", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => {
            ALLOWED_UPDATES.includes(k);
        });

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed.");
        }

        if (data?.skills.length > 10) {
            throw new Error("You cannot add more than 10 skills.");
        }

        const userUpdate = await User.findByIdAndUpdate(userId, data, options);
        if (userUpdate.lenght === 0) {
            res.status(404).send("something went wrong.");

        } else {
            res.send("successfully updated user data.");
        }
    } catch (err) {
        if (err.message === null || err.message === undefined || err.message === '' || err.message === NaN) {
            err.message = "Something went wrong.";
        }
        res.status(400).send(err.message);
    }
});

module.exports = userRouter;

