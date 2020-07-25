const express = require('express');
const { createUser, deleteUser, loginUser } = require('../controllers/user');

const router = express.Router();

router.post('/users', createUser);
router.post('/users/login', loginUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
