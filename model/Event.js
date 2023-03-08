const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  date: String,
  name: String,
  event_img: Array,
  event_image: {type: mongoose.Schema.Types.Mixed, default: {}},
  seats: [
    {
      orchestre: {
        type: Number,
        required: true,
      },
      mezzanine: {
        type: Number,
        required: true,
      },
    },
  ],
  orchestrePrice: {
    type: Number,
    required: true,
  },
  mezzaninePrice: {
    type: Number,
    required: true,
  },
});
module.exports = Event;
