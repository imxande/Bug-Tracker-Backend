// import express and create a router
const router = require("express").Router();

// register endpoint and handler
router.post("/register", (req, res) => {
  res.json({
    message: "Response from auth router! ",
  });
});

module.exports = router;
