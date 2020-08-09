import './config';
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from './libs/passport';
import initSession from './libs/session';

const dev = process.env.NODE_ENV === 'development';
const app = polka();

const session = initSession(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev')); // TODO: make conditional, only for dev
app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(
    sapper.middleware({
        session: (req, res) => {
            return {
                user: req.user
            };
        }
    })
);

export default app;
