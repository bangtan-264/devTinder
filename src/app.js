const express = require('express');
const app = express();
const connectDb = require("./config/database.js");
const { userAuth } = require("./middlewares/auth");
const User = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user || user.length === 0) {
            res.send("Invalid credentials");
        }

        const isValidPassword = await user.validatePassword(user.password);
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//get user by email 
app.get("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
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
app.delete("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    const options = {
        returnDocument: 'before'
    };
    try {
        const ALLOWED_UPDATES = ("firstName", "lastName", "age", "gender", "phototUrl", "about", "skills");
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
