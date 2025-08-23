const validator = require("validator");

const validateSignupData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (!firstName || !lastName) {
        throw new Error("Please enter a valid name.");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email id.");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strog password");
    }
}

module.exports = { validateSignupData };