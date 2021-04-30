// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "m2_proj_DanHab";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;
app.locals.isBooking = false;
app.locals.previousLocation = null;
app.locals.isBusiness = false;

// Set up session
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/m2_proj_DanHab",
      ttl: 24 * 60 * 60,
    }),
  })
);

app.use((req, res, next) => {
  req.app.locals.isUserLoggedIn = !!req.session.userInfo;
  if (req.session.userInfo) {
    req.app.locals.isBusiness = req.session.userInfo.isBusiness;
  }

  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const location = require("./routes/location.routes");
app.use("/", location);

const auth = require("./routes/auth.routes");
app.use("/", auth);

const user = require("./routes/user.routes");
app.use("/", user);

app.get("*", (req, res, next) => {
  res.render("not-found");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
