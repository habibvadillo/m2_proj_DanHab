let Location = require("../models/Location.model");
const mongoose = require("mongoose");

require("../db");

const myLocations = [
  { name: "Everest", location: "Malaysia" },
  { name: "Himalaya", location: "Russia" },
  { name: "Fuji Town", location: "Moldova" },
  { name: "Red Snow", location: "Russia" },
  { name: "Great Alps", location: "Russia" },
];

Location.create(myLocations)
  .then(() => {
    console.log("locations created", myLocations);
    mongoose.connection.close();
  })
  .catch((err) => {
    mongoose.connection.close();
  });
