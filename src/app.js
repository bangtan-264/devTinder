const express = require('express');
const app = express();

//This will only handle GET call to /user
app.get("/user", (req, res) => {
    res.send({firstName: "Sahil Verma", lastName: "Verma", age: "22"});
});

app.post("/user", (req, res) => {
    res.send("User data saved successfully");
});

app.put("/user", (req, res) => {
    res.send("User data updated successfully");
});

app.patch("/user", (req, res) => {
    res.send("User age updated successfully");
});

app.delete("/user", (req, res) => {
    res.send("user deleted successfully");
});

//This will match all the HTTP method api call to /test
app.use("/test", (req, res) => {
    res.send("Hello from Mr. Test-ick-llsss");
});

app.listen('7777', () => {
    console.log('Server is successfully running');
});