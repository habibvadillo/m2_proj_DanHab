const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const reservationSchema = new Schema({
  skiTicketDate: {
     type: Date,
     required: true
    },
    location: {type: Schema.Types.ObjectId, ref: 'Location'}, 
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Reservation = model("Reservation", reservationSchema);

module.exports = Reservation;
