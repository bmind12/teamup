import send from '@polka/send-type';
import User from '../../models/User';
import { authenticateLocal } from '../../libs/passport';

const DUPLICATE_KEY_ERROR_CODE = 11000;

export async function post(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.createUser(email, password);

        authenticateLocal(req, res, () => {
            return send(res, 201, { user });
        });
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            return send(res, 409, 'Email already exists');
        }

        return send(res, 400, 'An error occured');
    }
}
