const router = require("express").Router();

const Location = require("../models/Location.model");
const Usermodel = require("../models/User.model");

// BUSINESS ACCOUNT

// middleware to protect routes for business
const authorize = (req, res, next) => {
  if (req.session?.userInfo && req.session?.userInfo?.isBusiness) {
    next();
  } else {
    res.redirect("/signin");
  }
};

router.get("/user/businessprofile", authorize, (req, res, next) => {
  res.render("user/businessprofile.hbs", {
    styles: "user/businessprofile.css",
  });
});

// business profile locations
router.get("/user/locations/create", (req, res, next) => {
  res.render("user/user-locations-create.hbs", {
    styles: "user/user-locations-create.css",
  });
});

router.post("/user/locations/create", authorize, (req, res, next) => {
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

router.get("/user/locations", authorize, (req, res, next) => {
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

// EDIT LOCATION
router.get("/user/locations/:id/edit", authorize, (req, res, next) => {
  const { id } = req.params;
  Location.findById(id)
    .then((result) => {
      res.render("user/update-location.hbs", {
        result,
        styles: "user/update-location.css",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/user/locations/:id/edit", authorize, (req, res, next) => {
  const { id } = req.params;
  const { name, location } = req.body;
  Location.findByIdAndUpdate(id, { name, location })
    .then((result) => {
      res.redirect("/user/locations");
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE LOCATION
router.post("/user/locations/:id/delete", authorize, (req, res, next) => {
  const { id } = req.params;
  Location.findByIdAndDelete(id)
    .then(() => res.redirect("/user/locations"))
    .catch((err) => console.log(err));
});

//personal profile ////////

router.get("/user/profile", authorize, (req, res, next) => {
  Usermodel.findById(req.session.userInfo._id)
    .populate("skiPasses")
    .then((data) => {
      res.render("user/profile.hbs", {
        data,
        styles: "user/profile.css",
      });
    })
    .catch((err) => {});
});

router.post("/bookpass", (req, res, next) => {
  const { id } = req.body;
  Location.findById(id)
    .then((result) => {
      console.log(result);
      Usermodel.findByIdAndUpdate(req.session.userInfo._id, {
        $push: { skiPasses: id },
      })
        .then((result) => {
          console.log(result);
          res.redirect("user/profile");
        })
        .catch((err) => {
          console.log("FAILED!!");
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
