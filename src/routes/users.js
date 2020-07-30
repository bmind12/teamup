const express = require('express');
const {
    createUser,
    deleteUser,
    loginUser,
    logoutAll,
    logout
} = require('../controllers/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/users', createUser);
router.post('/users/login', loginUser);
router.delete('/users/me', auth, deleteUser);
router.post('/users/logoutAll', auth, logoutAll);
router.post('/users/logout', auth, logout);

module.exports = router;
