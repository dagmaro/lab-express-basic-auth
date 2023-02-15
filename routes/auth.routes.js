const router = require("express").Router();

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// GET "/auth/signup"
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup"
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  // validación password
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      error:
        "The password should have at least 8 char, one uppercase, one lowercase and special char",
    });
    return;
  }

  // validación fields
  if (username === "" || password === "") {
    res.render("auth/signup.hbs", {
      error: "All the fields should not be empty",
    });
    return;
  }
  try {
    const uniqueUser = User.findOne({ username: username });
    if (uniqueUser === null) {
      res.render("auth/signup.hbs", {
        error: "Username already exists",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hashpassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// GET "/auth/login"
router.get("/login",(req,res,next)=>{
  res.render("auth/login.hbs")
})

// POST "/auth/login"
router.post("/login",async(req,res,next)=>{
  const {username, password} = req.body
  // validación fields
  if (username === "" || password === "") {
    res.render("auth/signup.hbs", {
      error: "All the fields should not be empty",
    });
    return;
  }
  try {
    // Verificacion si el user esta registrado
    const foundUser = await User.findOne({username: username})
    if (foundUser === null) {
      res.render("auth/login.hbs",{
        error: "Username is not registered"
      })
      return
    }
    // Verificacion si el password es correcto o no
    const passwordIsCorrect = await bcrypt.compare(password, foundUser.password)
    if (passwordIsCorrect === false){
      res.render("auth/login.hbs", {
        error: "Incorrect password"
      })
      return
    }
    // Verificar si el user esta activo en la sesion
    req.session.activeUser = foundUser;
    req.session.save(()=>{
      res.redirect("/profile")
    })
  } catch (error) {
    next(error)
  }
  // Verificacion de logout
  router.get("/logout", (req,res,next)=>{
    req.session.destroy(()=>{
      res.redirect("/")
    })
  })
})


module.exports = router;
