import send from '@polka/send-type';

export default async (req, res, next) => {
    if (req.user) return next();

    return send(res, 401, 'User is not logged in');
};
