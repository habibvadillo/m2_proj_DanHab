const router = require("express").Router();

const Location = require("../models/Location.model");
const Usermodel = require("../models/User.model");
const Reservation = require("../models/Reservation.model");
const uploader = require("../middlewares/cloudinary.config.js");
const { single } = require("../middlewares/cloudinary.config.js");

/// BUSINESS ACCOUNT ///

// middleware to protect routes for business
const authorize = (req, res, next) => {
  if (req.session?.userInfo && req.session?.userInfo?.isBusiness) {
    next();
  } else {
    res.redirect("/signin?notBusiness=true");
  }
};

// Business account page
router.get("/user/businessprofile", authorize, (req, res, next) => {
  res.render("user/businessprofile.hbs", {
    styles: "user/businessprofile.css",
  });
});
// Create business locations
router.get("/user/locations/create", authorize, (req, res, next) => {
  res.render("user/user-locations-create.hbs", {
    styles: "user/user-locations-create.css",
  });
});

router.post(
  "/user/locations/create",
  authorize,
  uploader.array("imageUrl"),
  (req, res, next) => {
    const { name, location, description, website } = req.body;
    const { _id } = req.session.userInfo;
    let arr = req.files.map((elem) => {
      return elem.path;
    });
    Location.create({
      name,
      location,
      description,
      website,
      owner: _id,
      locPicture: arr,
    })
      .then((result) => {
        res.redirect("/user/locations");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

// Business locations
router.get("/user/locations", authorize, (req, res, next) => {
  const { _id } = req.session.userInfo;
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

// Edit location
router.get("/user/locations/:id/edit", authorize, (req, res, next) => {
  const { id } = req.params;

  Location.findById(id)

    .then((result) => {
      console.log(result);
      res.render("user/update-location.hbs", {
        result,
        styles: "user/update-location.css",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post(
  "/user/locations/:id/edit",
  authorize,
  uploader.array("imageUrl"),
  (req, res, next) => {
    const { id } = req.params;
    const { name, location, description, website } = req.body;

    let arr = req.files.map((elem) => {
      return elem.path;
    });
    console.log(arr, "this is the images array");
    const locationToEdit = { name, location, description, website };
    if (req.files.length) locationToEdit.locPicture = arr; // only add locations if user uploaded some new pictures
    console.log(locationToEdit, "this is the location after adding the array");

    Location.findByIdAndUpdate(id, locationToEdit)
      .then((result) => {
        res.redirect("/user/locations");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

// Delete location
router.post("/user/locations/:id/delete", authorize, (req, res, next) => {
  const { id } = req.params;
  Location.findByIdAndDelete(id)
    .then(() => res.redirect("/user/locations"))
    .catch((err) => console.log(err));
});

/// PERSONAL ACCOUNT ///

// middleware to protect routes for personal account
const authorizePerson = (req, res, next) => {
  if (req.session?.userInfo) {
    next();
  } else {
    res.redirect("/signin");
  }
};

// Personal account page
router.get("/user/profile", authorizePerson, (req, res, next) => {
  if (req.session.userInfo.isBusiness) {
    res.redirect("/user/businessprofile");
  } else {
    Usermodel.findById(req.session.userInfo._id)
      .then((data) => {
        Reservation.find({ user: data._id })
          .populate("location")
          .populate("user")

          .then((response) => {
            res.render("user/profile.hbs", {
              response,
              styles: "user/profile.css",
            });
          });
      })
      .catch((err) => {});
  }
});

// Book Skipass
router.post("/bookpass", (req, res, next) => {
  const { id } = req.body;
  const { _id } = req.session.userInfo;
  Reservation.create({ skiTicketDate: Date.now(), location: id, user: _id })
    .then((result) => {
      res.redirect("/user/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Cancel Ski Pass
router.post(
  "/user/profile/skipasses/:id/cancel",
  authorizePerson,
  (req, res, next) => {
    const { id } = req.params;
    Reservation.findByIdAndDelete(id)
      .then((result) => {
        res.redirect("/user/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

module.exports = router;
