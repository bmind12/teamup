const express = require('express');
const {
    create,
    deleteUser,
    login,
    logout,
    updateUser
} = require('../controllers/user');
const { authenticateLocal } = require('../libs/passport');
const auth = require('../middleware/auth');

const router = express.Router();
router.post('/users', create);
router.post('/users/login', authenticateLocal, login);
router.delete('/users/me', auth, deleteUser);
router.post('/users/logout', auth, logout);
router.patch('/users/me', auth, updateUser);

module.exports = router;
