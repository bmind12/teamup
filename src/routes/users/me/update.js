import send from '@polka/send-type';
import User from '../../../models/User';

const DUPLICATE_KEY_ERROR_CODE = 11000; // TODO: violates DRY

export async function patch(req, res) {
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
