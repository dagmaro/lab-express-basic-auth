const router = require("express").Router();

const {isLoggedIn} = require("../middlewares/auth-middleware.js")

// GET renderizar la ruta de profile
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("profile/private.hbs")
})

// main "/profile/main"
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("profile/main.hbs")
})


module.exports = router;