import { compose } from 'compose-middleware';
import send from '@polka/send-type';
import auth from '../../middleware/auth';
import User from '../../models/User';

const DUPLICATE_KEY_ERROR_CODE = 11000; // TODO: violates DRY

export const del = compose([
    auth,
    async (req, res) => {
        const user = await req.user.remove();

        return send(res, 200, { user });
    }
]);

export const patch = compose([
    auth,
    async (req, res) => {
        try {
            const newData = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                newData,
                { new: true }
            );

            return send(res, 200, { user: updatedUser });
        } catch (err) {
            if (err.code === DUPLICATE_KEY_ERROR_CODE) {
                return send(res, 409, 'Email already exists');
            }

            return send(res, 400, { user });
        }
    }
]);
