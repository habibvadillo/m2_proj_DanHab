
const router = require("express").Router()

const Location = require('../models/Location.model')

router.get("/locations", (req, res, next) => {
  const queryObj = {}
  if (req.query.location) {
    queryObj.location = req.query.location
  }
  Location.find(queryObj)
  .then((result) => {
    res.render("locations/locations.hbs", {locations: result})
  }).catch((err) => {
    console.log(err)
  });
});



module.exports = router

