const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://admin-sahil:Jungkook426@cluster0.duay5k8.mongodb.net/devTinder");
};

module.exports = connectDb;