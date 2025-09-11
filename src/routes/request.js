const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:uid", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const targetUserId = req.params.uid;
        const sourceUserId = req.user._id;

        //status check
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Please select a valid status.");
        }

        //target user id check
        const targetUser = await user.findById(targetUserId);
        if (!targetUser) {
            throw new Error("Invalid request.")
        }

        //existing reqeust check
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { sourceUserId, targetUserId },
                { sourceUserId: targetUserId, targetUserId: sourceUserId }
            ]
        });
        if (existingRequest) {
            throw new Error("Request already exists.");
        }

        const request = new ConnectionRequest({
            sourceUserId,
            targetUserId,
            status
        })
        const data = await request.save();

        res.json({
            status: true,
            data: data
        })
    } catch (err) {
        res.status(400).json({
            status: false,
            error: err?.message ?? "Something went wrong. Please try again later."
        })
    }

});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Status not allowed");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            targetUserId: loggedInUser._id,
            status: "interested",
        });

        if (!connectionRequest) {
            throw new Error("Request does not exists.")
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            status: true,
            data: data
        })
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err?.message ?? "Something went wrong. Please try again later"
        });
    }
});
module.exports = requestRouter;