const router = require("express").Router();

const Location = require("../models/Location.model");
const Usermodel = require("../models/User.model");
const Reservation = require("../models/Reservation.model");
const uploader = require('../middlewares/cloudinary.config.js');


/// BUSINESS ACCOUNT ///

// middleware to protect routes for business
const authorize = (req, res, next) => {
  if (req.session?.userInfo && req.session?.userInfo?.isBusiness) {
    next();
  } else {
    res.redirect("/signin");
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
  res.render("locations/locations-create.hbs", {
    styles: "locations/locations-create.css",
  });
});

router.post("/user/locations/create", authorize, uploader.single("imageUrl"), (req, res, next) => {
  const { name, location} = req.body;
  const { _id } = req.session.userInfo;
  Location.create({ name, location, owner: _id, locPicture: req.file.path })
    .then((result) => {
      res.redirect("/user/locations");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Business locations
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

// Edit location
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
  Usermodel.findById(req.session.userInfo._id)
    .then((data) => {
      Reservation.find({user: data._id})
      .populate('location')
      .populate('user')
      
      .then((response) => {
        res.render("user/profile.hbs", {
          response,
          styles: "user/profile.css",
        });

      })
    })
    .catch((err) => {});
});

// Book Skipass
router.post("/bookpass", (req, res, next) => {
  const {id} = req.body;
  const {_id} = req.session.userInfo
  Reservation.create({skiTicketDate: Date.now(), location: id, user: _id})
  .then((result) => {
    res.redirect('/user/profile')
  }).catch((err) => {
    console.log(err)
  });
});

// Cancel Ski Pass
router.post("/user/profile/skipasses/:id/cancel", authorizePerson, (req, res, next) => {
  const { id } = req.params;
  Reservation.findByIdAndDelete(id)
  .then((result) => {
    res.redirect("/user/profile")
  })
  .catch((err) => {
    console.log(err)
  });
})

module.exports = router;

