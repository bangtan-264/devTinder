const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    sourceUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid status.`
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({ sourceUserId: 1, targetUserId: 1 });

//will be invoked pre-save 
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.sourceUserId.equals(connectionRequest.targetUserId)) {
        throw new Error("Cannot send connection request to yourself.");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;