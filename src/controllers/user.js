import User from '../models/User';
import { authenticateLocal } from '../libs/passport';

const DUPLICATE_KEY_ERROR_CODE = 11000;

export const create = async (req, res) => {
    console.log('### IAM HERE req.body', req.body);
    const { email, password } = req.body;

    try {
        console.log('### IAM HERE 1');
        const user = await User.createUser(email, password);
        console.log('### IAM HERE 2');

        authenticateLocal(req, res, () => res.status(201).send({ user }));
        console.log('### IAM HERE 3');
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(409).send('Email already exists');
        }

        return res.status(400).send('An error occured');
    }
};

export const updateUser = async (req, res) => {
    try {
        const newData = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            newData,
            { new: true }
        );

        return res.send({ user: updatedUser });
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(409).send('Email already exists');
        }

        return res.status(400).send('An error occured');
    }
};

export const deleteUser = async (req, res) => {
    const user = await req.user.remove();

    return res.send(user);
};

export const login = async (req, res) => {
    res.send({ user: req.user });
};

export const logout = async (req, res) => {
    const { user, session } = req;

    session.destroy();

    res.send({ user });
};
