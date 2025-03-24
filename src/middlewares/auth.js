const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = (token === "xyz");
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(404).send("Unauthorized access");
    }
};

const userAuth = (req, res, next) => {
    console.log("User auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = (token === "xyz");
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(404).send("Unauthorized access");
    }
};

module.exports = {
    adminAuth,
    userAuth
}