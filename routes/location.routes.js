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


// EDIT LOCATION
router.get("/user/locations/:id/edit", (req, res, next) => {
  const {_id} = req.params
  Location.findById(_id)
  .then((result) => {
    res.render('user/update-location.hbs', {result})
  }).catch((err) => {
    console.log(err)
  });
})

router.post("/user/locations/:id/edit", (req, res, next) => {
  const {_id} = req.params
  const {name, location} = req.body
  Location.findByIdAndUpdate(_id, {name, location})
  .then((result) => {
    res.redirect('/user/locations')
  }).catch((err) => {
    console.log(err)
  });
})

// DELETE LOCATION
router.post('/user/locations/:id/delete', (req, res, next) => {
  const {id}= req.params
  Location.findByIdAndDelete(id)
  .then(()=>res.redirect('/user/locations'))
  .catch((err)=>console.log(err))
});


module.exports = router;
