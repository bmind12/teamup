import { compose } from 'compose-middleware';
import send from '@polka/send-type';
import auth from '../../middleware/auth';

export const post = compose([
    auth,
    (req, res) => {
        const { user, session } = req;

        session.destroy();

        send(res, 200, { user });
    }
]);
