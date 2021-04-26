const router = require("express").Router();

const Location = require('../models/Location.model')

//business profile

router.get('/user/locations/create', (req, res, next) => {
  res.render('locations/locations-create.hbs')
})

router.post("/user/locations/create", (req, res, next) => {

  const {name, location} = req.body
  
  const {_id} = req.session.userInfo
  console.log(name, location, _id)
  Location.create({name, location, owner: _id})
  .then((result) => {

    res.redirect("user/locations")
  }).catch((err) => {
    console.log(err)
  });
})

router.get("/user/locations", (req, res, next) => {
  const {_id} = req.session.userInfo
  console.log(_id)
  Location.find({owner: _id})
  
  .then((locations) => {
    res.render('user/user-locations', {locations})
  }).catch((err) => {
    console.log(err)
  });
})






//personal profile

module.exports = router