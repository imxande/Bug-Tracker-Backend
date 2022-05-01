// import express and create a router
const router = require("express").Router();

// import customer validation
const customerValidation = require("../customers/customerValidation");

// register endpoint and handler
router.post("/register", (req, res) => {
  // store request body
  const customer = req.body;

  // validate that the body of request contains the related info needed to create a new customer
  const validated = customerValidation(customer);
  // if info is good to go let us add the new customer info to our data base
  // if not we will need to send an error message base on what went wrong and how to fix it

  // send response back
  res.send(customer);
});

module.exports = router;
