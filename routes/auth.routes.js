const router = require("express").Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

// Shows the user the sign in form
router.get("/signin", (req, res) => {
  let msg;
  if (req.query.hasOwnProperty("notBusiness")) {
    msg = "You need to be a business to access that page";
  }
  if (req.query.hasOwnProperty("locationid")) {
    const { locationid } = req.query;
    req.app.locals.isBooking = true;
    req.app.locals.previousLocation = locationid;
  } else {
    req.app.locals.isBooking = false;
  }
  res.render("auth/signin.hbs", { styles: "auth/signin.css", msg });
});

// Shows the user the sign up form
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs", { styles: "auth/signup.css" });
});

router.post("/signup", (req, res, next) => {
  const { username, email, password, isBusiness = false } = req.body;
  console.log(req.body);
  console.log(typeof isBusiness, "isBusiness value");
  if (!username || !email || !password) {
    res.render("auth/signup.hbs", {
      msg: "Please fill in all details",
      styles: "auth/signup.css",
    });
    return;
  }

  // password validation
  const passCharacters = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{1,}/;
  if (!passCharacters.test(password)) {
    res.render("auth/signup.hbs", {
      styles: "auth/signup.css",
      msg:
        "Password must be min. 8 characters, must have a number, an uppercase Letter, and a special character",
    });
    return;
  }

  // email validation
  const emailAt = /^[^@ ]+@[^@ ]+\.[^@ ]+$/;
  if (!emailAt.test(String(email).toLowerCase())) {
    res.render("auth/signup.hbs", {
      styles: "auth/signup.css",
      msg: "Please enter a valid email",
    });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  // create user
  UserModel.create({
    username,
    email,
    password: hash,
    isBusiness,
    skiPasses: [],
  })
    .then(() => {
      res.redirect("/signin");
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
          styles: "auth/signin.css",
          msg: "Error: Incorrect login details",
        });
      } else {
        bcrypt.compare(password, response.password).then((isMatching) => {
          if (isMatching) {
            console.log(req.app.locals.isBooking);
            req.session.userInfo = response;
            req.app.locals.isUserLoggedIn = true;

            if (req.app.locals.isBooking) {
              res.redirect("/locations/" + req.app.locals.previousLocation);
            } else {
              res.redirect("/");
            }
          } else {
            res.render("auth/signin", {
              styles: "auth/signin.css",
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
  req.app.locals.isBusiness = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
