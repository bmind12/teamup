const express = require('express');
const {
    createUser,
    deleteUser,
    loginUser,
    logout
} = require('../controllers/user');
const { authenticateLocal } = require('../libs/passport');
const auth = require('../middleware/auth');

const router = express.Router();
router.post('/users', createUser);
router.post('/users/login', authenticateLocal, loginUser);
router.delete('/users/me', auth, deleteUser);
router.post('/users/logout', auth, logout);

module.exports = router;
