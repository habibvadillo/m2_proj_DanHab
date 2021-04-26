const router = require("express").Router();
const Location = require("../models/Location.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Location.find()
    .then((locations) => {
      let uniques = [];
      locations.forEach((l) => {
        if (!uniques.includes(l.location)) {
          uniques.push(l.location);
        }
      });
      console.log(uniques);
      res.render("index", { uniques });
    })
    .catch((err) => {});
});

module.exports = router;
