const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  res.send({ req: req.body });
});

module.exports = router;
