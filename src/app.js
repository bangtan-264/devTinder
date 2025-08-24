const express = require('express');
const app = express();
const connectDb = require("./config/database.js");
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const profileRouter = require("./routes/profile.js");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);

connectDb()
    .then(() => {
        console.log("Database connection established successfully.");

        app.listen('7777', () => {
            console.log('Server is successfully running');
        });
    })
    .catch((err) => {
        console.error("Databse connection failed. Error is :", err);
    });

// when we use User.findOne() for a emailId that exists for two users, which user data will it return ?
// API - Get user by id : use User,findById() 
