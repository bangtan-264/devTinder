const express = require('express');
const app = express();

const connectDb = require("./config/database.js");
// const {adminAuth, userAuth} = require("./middlewares/auth");
const User = require("./models/user.js");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName : "Sahil", 
        lastName : "Verma", 
        emailId: "sahilverma2642@gmail.com",
        password: "Pswd@123"
    });

    try {
        await user.save();
        res.send("user saved successfully");   
    } catch(err) {
        res.status(404).send("Error in saving user :", err);
    }
});

connectDb()
.then(() => {
    console.log("Database connection established successfully");

    app.listen('7777', () => {
        console.log('Server is successfully running');
    });
})
.catch((err) => {
    console.error("Databse connection failed. Error is :", err);
});