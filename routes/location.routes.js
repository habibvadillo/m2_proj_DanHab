const router = require("express").Router();

const Location = require("../models/Location.model");

router.get("/locations", (req, res, next) => {
  const queryObj = {};
  if (req.query.country) {
    queryObj.location = req.query.country;
  }
  // if (req.query.rating) {
  //   queryObj.rating = req.query.rating;
  // }
  Location.find()
    .then((locations) => {
      let uniques = [];
      locations.forEach((l) => {
        if (!uniques.includes(l.location)) {
          uniques.push(l.location);
        }
      });
      Location.find(queryObj).then((result) => {
        console.log(result);
        res.render("locations/locations.hbs", {
          result,
          uniques,
          styles: "locations/locations.css",
        });
      });
    })
    .catch((err) => {});
});

router.get("/locations/:id", (req, res, next) => {
  const { id } = req.params;
  Location.findById(id)
    .then((result) => {
      res.render("locations/locationpage.hbs", {
        result,
        styles: "locations/locationpage.css",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
