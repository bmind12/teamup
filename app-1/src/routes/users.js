const express = require('express');
const { createUser, deleteUser } = require('../controllers/user');

const router = express.Router();

router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
