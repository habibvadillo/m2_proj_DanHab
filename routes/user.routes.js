const router = require("express").Router();

const Location = require("../models/Location.model");

//business profile

router.get("/user/businessprofile", (req, res, next) => {
  res.render("user/businessprofile.hbs", {
    styles: "user/businessprofile.css",
  });
});

// business profile locations
router.get("/user/locations/create", (req, res, next) => {
  res.render("locations/locations-create.hbs", {
    styles: "locations/locations-create.css",
  });
});

router.post("/user/locations/create", (req, res, next) => {
  const { name, location } = req.body;

  const { _id } = req.session.userInfo;
  console.log(name, location, _id);
  Location.create({ name, location, owner: _id })
    .then((result) => {
      res.redirect("/user/locations");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/locations", (req, res, next) => {
  const { _id } = req.session.userInfo;
  console.log(_id);
  Location.find({ owner: _id })

    .then((locations) => {
      res.render("user/user-locations", {
        locations,
        styles: "user/user-locations.css",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//personal profile
router.get("/user/profile", (req, res, next) => {
  res.render("user/profile.hbs", { styles: "user/profile.css" });
});

module.exports = router;
