const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  date: String,
  name: String,
  event_img: Object,
  seats: {
    orchestre: Number,
    mezzanine: Number,
  },
});
module.exports = Event;
