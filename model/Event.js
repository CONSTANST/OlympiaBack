const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  date: String,
  name: String,
  event_img: {type: mongoose.Schema.Types.Mixed, default: {}},
  seats: {
    orchestre: Number,
    mezzanine: Number,
  },
});
module.exports = Event;
