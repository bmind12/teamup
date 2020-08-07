import send from '@polka/send-type';

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
