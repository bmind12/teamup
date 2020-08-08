import { compose } from 'compose-middleware';
import send from '@polka/send-type';
import { authenticateLocal } from '../../libs/passport';

export const post = compose([
    authenticateLocal,
    (req, res) => {
        return send(res, 200, { user: req.user });
    }
]);
