// imports
const express = require("express");
const cors = require("cors");
const morgan = require("cors");
const helmet = require("cors");

// create express app
const app = express();

// adding helmet for layer of security
app.use(helmet());

// adding morgan to log http request
app.use(morgan());

// enhancing cross-origin resource sharing
app.use(cors());

// Parsing incoming requests with JSON payloads
app.use(express.json());

// Initial request
app.get("/", (req, res) => {
  // send some message
  res.send("Hello from the server!");
});

// exports
module.exports = app;
