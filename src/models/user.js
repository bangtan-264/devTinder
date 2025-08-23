const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 100,
            trim: true
        },
        lastName: {
            type: String,
            minLength: 3,
            maxLength: 100,
            trim: true
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return validator.isEmail(v);
                },
                message: props => `${props.value} is not an email.`
            }
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error(`${value} is not a strong password.`);
                }
            }
        },
        age: {
            type: Number,
            min: 5
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender data is not valid.");
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            validate: {
                validator: function (v) {
                    return validator.isURL(v);
                },
                message: props => "Please provide a valid photo url."
            }
        },
        about: {
            type: String,
            default: "This is default about descritpion.",
            minLength: 30,
            maxLenght: 300
        },
        skills: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length <= 10;
                },
                message: props => "You can add upto 10 skills only."
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "dev@tinder.com",
        { expiresIn: '7d' }
    );

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid
}

const User = mongoose.model("User", userSchema);

module.exports = User;