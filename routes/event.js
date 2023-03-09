const express = require("express");
const router = express.Router();
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");
const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");
// const convertToBase64 = require("../utils/convertToBase64");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/upload", fileUpload(), async (req, res) => {
  try {
    const pictureToUpload = req.files.picture;
    const result = await cloudinary.uploader.upload(
      convertToBase64(pictureToUpload)
    );
    return res.json(result);
  } catch (error) {
    console.log("erreur", error);
    return res.json({error: error.message});
  }
});

router.post("/events/create", fileUpload(), async (req, res) => {
  try {
    const {name, date} = req.body;
    const event = await Event.findOne({
      name: name,
      date: date,
    });
    if (event) {
      res.json("This event aldready existe");
    } else {
      const {orchestre, mezzanine, orchestrePrice, mezzaninePrice} = req.body;
      const newEvent = new Event({
        date: date,
        name: name,
        orchestrePrice: orchestrePrice,
        mezzaninePrice: mezzaninePrice,
        seats: [
          {
            orchestre: orchestre,
            mezzanine: mezzanine,
          },
        ],
      });

      if (req.files.event_image) {
        const result = await cloudinary.uploader.upload(
          convertToBase64(req.files.event_image),
          {
            folder: `api/Olymplia-v2/${newEvent._id}`,
            public_id: "preview",
          }
        );

        newEvent.event_image = result;
        newEvent.event_img.push(result);
      }
      await newEvent.save();

      res.json({
        message: "Event successfully created",
        date: date,
        name: name,
        seats: {
          orchestre: orchestre,
          mezzanine: mezzanine,
        },
        event_img: newEvent.event_img,
        id: newEvent.id,
      });
    }
  } catch (error) {
    res.json({message: error.message});
  }
});
router.get("/events", async (req, res) => {
  try {
    const event = await Event.find(req.query);
    if (event) {
      res.json(event);
    } else {
      res.json({message: "Evenement non trouver"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.json({message: "Evenement non trouver"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

router.get("/event/availabilities", async (req, res) => {
  try {
    const event = await Event.find({
      date: req.query.date,
    });

    if (event) {
      res.json(event);
    } else {
      res.json({message: "Aucun évenement à cette date"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

router.put("/event/modify/:eventId", fileUpload(), async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const {date, name, orchestre, mezzanine, orchestrePrice, mezzaninePrice} =
      req.body;
    const eventToModify = await Event.findById(eventId);
    if (date) eventToModify.date = date;
    if (name) eventToModify.name = name;
    if (orchestre) eventToModify.seats[0].orchestre = orchestre;
    if (mezzanine) eventToModify.seats[0].mezzanine = mezzanine;
    if (orchestrePrice) eventToModify.orchestrePrice = orchestrePrice;
    if (mezzaninePrice) eventToModify.mezzaninePrice = mezzaninePrice;

    if (req.files?.event_image) {
      const result = await cloudinary.uploader.upload(
        convertToBase64(req.files.event_image)
      );

      eventToModify.event_image = result;
      eventToModify.event_img.push(result);
    }

    await eventToModify.save();
    res.status(200).json(eventToModify);
  } catch (error) {
    res.json({message: error.message});
  }
});

router.delete("/events/delete/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (event) {
      await Event.findByIdAndDelete(eventId);
      await Ticket.deleteMany({event: eventId});
      res.status(200).json({message: `${event.name} a été supprimer`});
    } else {
      res.json({message: "Evenement non trouver"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

module.exports = router;
