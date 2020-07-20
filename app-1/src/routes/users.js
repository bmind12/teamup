const express = require('express');

const router = express.Router();

router.post('/users', (req, res) => {
    res.send(req.body);
});

module.exports = router;
