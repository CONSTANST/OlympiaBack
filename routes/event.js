const express = require("express");
const router = express.Router();
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");
const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");

router.post("/events/create", async (req, res) => {
  try {
    const {name, date} = req.body;
    const event = await Event.findOne({
      name: name,
      date: date,
    });
    if (event) {
      res.json("This event aldready existe");
    } else {
      const {orchestre, mezzanine} = req.body.seats;

      const newEvent = new Event({
        date: date,
        name: name,
        seats: {
          orchestre: orchestre,
          mezzanine: mezzanine,
        },
      });
      await newEvent.save();
      res.json({message: "Event successfully created"});
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
    const event = await Event.findById(req.query._id);
    if (event) {
      res.json(event);
    } else {
      res.json({message: "Evenement non trouver"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

router.get("/events/availabilities", async (req, res) => {
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
router.put("/event/modify/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const {date, name, category} = req.body;
    const eventToModify = await Event.findById(eventId);
    if (date) eventToModify.date = date;
    if (name) eventToModify.name = name;
    if (category) eventToModify.caterogy = category;
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
