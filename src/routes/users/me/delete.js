import { compose } from 'compose-middleware';
import send from '@polka/send-type';

import auth from '../../../middleware/auth';

export const del = compose([
    auth,
    async (req, res) => {
        const user = await req.user.remove();

        return send(res, 200, { user });
    }
]);
