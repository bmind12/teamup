const express = require('express');
const { createUser, deleteUser, loginUser } = require('../controllers/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/users', createUser);
router.post('/users/login', loginUser);
router.delete('/users/me', auth, deleteUser);

module.exports = router;
