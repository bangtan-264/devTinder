const express = require('express');
const app = express();

const connectDb = require("./config/database.js");
// const {adminAuth, userAuth} = require("./middlewares/auth");
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("user saved successfully");   
    } catch(err) {
        res.status(400).send("Error in saving user :"+ err);
    }
});


//get user by email 
app.get("/user", async (req, res) => {
    const userEmailId = req.body.emailId;
    try {
        const user = await User.findOne({emailId : userEmailId});
        if(user.length === 0 ) {
            res.send("User doesn't exists for the given email id.");
        } else {
            res.send("User : "+ user);
        }
    } catch(err) {
        res.status(400).send("Something went wrong.");
    }
});

//Feed api - get all users data 
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0 ) {
            res.status(404).send("Something went wrong.");
        } else {
            res.send("Users : "+ users);
        }
    } catch(err) {
        res.status(400).send("Something went wrong.");
    }
});

//delete user by id 
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const userDelete =await User.findByIdAndDelete(userId);
        if (userDelete.length === 0) {
            res.status(404).send('Something went wrong.');
        } else {
            res.send('User deleted successfully');
        }
    } catch(err) {
        res.status(400).send("Something went wrong.");
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body._id;
    const data = req.body;
    const options = {
        returnDocument : 'before'
    };
    try {
        const userUpdate = await User.findByIdAndUpdate(userId, data, options);
        if (userUpdate.lenght === 0) {
            res.status(404).send("something went wrong.");
        } else {
            res.send("successfully updated user data.");
        }
    } catch (err) {
        res.status(400).send("something went wrong.");
    }
});

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
