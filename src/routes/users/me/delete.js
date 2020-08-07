import send from '@polka/send-type';

export async function del(req, res) {
    const user = await req.user.remove();

    return send(res, 400, { user });
}
