const express = require('express');
import {
    create,
    deleteUser,
    login,
    logout,
    updateUser
} from '../controllers/user';
import { authenticateLocal } from '../libs/passport';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/users', create);
router.post('/users/login', authenticateLocal, login);
router.delete('/users/me', auth, deleteUser);
router.post('/users/logout', auth, logout);
router.patch('/users/me', auth, updateUser);

export default router;
