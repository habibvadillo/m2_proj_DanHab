const router = require("express").Router();

const Location = require("../models/Location.model");
const Usermodel = require("../models/User.model")

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

// EDIT LOCATION
router.get("/user/locations/:id/edit", (req, res, next) => {
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

router.post("/user/locations/:id/edit", (req, res, next) => {
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
router.post("/user/locations/:id/delete", (req, res, next) => {
  const { id } = req.params;
  Location.findByIdAndDelete(id)
    .then(() => res.redirect("/user/locations"))
    .catch((err) => console.log(err));
});

//personal profile ////////
router.get("/user/profile", (req, res, next) => {
  res.render("user/profile.hbs", { styles: "user/profile.css" });
});


router.post("/bookpass", (req, res, next) => {
  const {id} = req.body
  console.log(id)
  console.log(req.body)
  Location.findById (id)
  .then((result) => {
    console.log(result)
    console.log(req.session.userInfo)
    Usermodel.findByIdAndUpdate(req.session.userInfo._id, {username: 'Jason Bourne'})
    .then((result) => {
      console.log(result)
      res.redirect("user/profile")

    }).catch((err) => {
      console.log(err)
    });
  }).catch((err) => {
    console.log(err)
  });
})

module.exports = router;
