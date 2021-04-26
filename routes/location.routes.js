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
        res.render("locations/locations.hbs", { result, uniques });
      });
    })
    .catch((err) => {});
});

module.exports = router;
