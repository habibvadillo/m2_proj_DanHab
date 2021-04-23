const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { findOneAndDelete } = require("../models/User.model");
const UserModel = require("../models/User.model");

// Shows the user the sign in form
router.get("/signin", (req, res) => {
  res.render("auth/signin.hbs");
});

// Shows the user the sign up form
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  //ifBusiness not included
  if (!username || !email || !password) {
    res.render("auth/signup.hbs", { msg: "Please fill in all details" });
    return;
  }

  // password validation
  const passCharacters = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/;
  if (!passCharacters.test(password)) {
    res.render("auth/signup.hbs", {
      msg:
        "Password must be min. 8 characters, must have a number, an uppercase Letter, and a special character",
    });
    return;
  }

  // email validation
  const emailAt = /^[^@ ]+@[^@ ]+\.[^@ ]+$/;
  if (!emailAt.test(String(email).toLowerCase())) {
    res.render("auth/signup.hbs", { msg: "Please enter a valid email" });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  // create user
  UserModel.create({ username, email, password: hash })
    .then(() => {
      // define the route
      res.redirect("/");
    })
    .catch((err) => {
      next();
    });
});

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then((response) => {
      if (!response) {
        res.render("auth/signin.hbs", {
          msg: "Email or password seems to be incorrect",
        });
      } else {
        bcrypt.compare(password, response.password).then((isMatching) => {
          if (isMatching) {
            req.session.userInfo = response;
            req.app.locals.isUserLoggedIn = true;
            res.redirect("/");
          } else {
            res.render("auth/signin", {
              msg: "Email or password seems to be incorrect",
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.app.locals.isUserLoggedIn = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
