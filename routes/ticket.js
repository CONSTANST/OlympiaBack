const express = require("express");
const router = express.Router();
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");
const isAfter = require("date-fns/isAfter");

router.post("/tickets/book", async (req, res) => {
  try {
    const {mail, username, category, seats} = req.body;
    if (!mail || !username || !category) {
      return res.status(400).json({message: "Requète invalide"});
    }

    if (
      seats > 4 ||
      seats < 1 ||
      (category !== "orchestre" && category !== "mezzanine")
    ) {
      return res.status(400).json({message: "Requète invalide"});
    }

    const event = await Event.findById(req.body.eventId);

    if (!event) {
      return res.json({message: "Evenement non trouver"});
    }

    if (!isAfter(new Date(), new Date(event.date))) {
      return res.status(400).json({
        message:
          " Vous ne pouvez pas reverser de tickets pour un évenement déjà passé",
      });
    }
    if (event.seats[category] < seats) {
      return res.json({message: "Not enought seats available"});
    }
    event.seats[category] = event.seats[category] - seats;
    await event.save();

    const tickets = new Ticket({
      mail: mail,
      username: username,
      date: new Date(),
      category: category,
      seats: seats,
      event: event,
    });
    await tickets.save();

    res.json({
      message: `${seats} sièges ont été réserver en ${category} pour ${event.name}`,
    });
  } catch (error) {
    res.json({message: error.message});
  }
});
router.post("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find({mail: req.body.mail}).populate("event");
    console.log(tickets);
    if (tickets) {
      res.json(tickets);
    } else {
      res.json({message: "Pas de reservation trouver pour cette utilisateur"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});
router.delete("/tickets/delete/:ticketsId", async (req, res) => {
  try {
    const ticketsId = req.params.ticketsId;
    const tickets = await Ticket.findById({
      _id: ticketsId,
    });

    if (tickets) {
      const event = await Event.findById(tickets.event);
      const category = event.seats[tickets.category];

      event.seats[category] = event.seats[category] + tickets.seats;

      await eventToUpdate.save();
      await Ticket.findByIdAndDelete(tickets);
      res.json(
        `${tickets.seats} place(s) a (ont) été annuler pour ${event.name}`
      );
    } else {
      res.json({message: "Pas de reservation trouver pour cette utilisateur"});
    }
  } catch (error) {
    res.json({message: error.message});
  }
});

module.exports = router;
