const isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {  //isAuthenticated() is a passport method
        req.flash("error", "Please log in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports = isLogin;