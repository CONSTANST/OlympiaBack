const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/OlympiaV2");
const routerEvent = require("./routes/event");
const routerTickets = require("./routes/ticket");
const routerUser = require("./routes/user");
app.use(routerEvent);
app.use(routerTickets);
app.use(routerUser);

app.all("*", (req, res) => {
  res.json({message: "hello, this page doesn't exist"});
});

app.listen(process.env.PORT || 3000, () => console.log("Server started!"));
