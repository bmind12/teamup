import dotenv from 'dotenv';
dotenv.config();
require('pretty-error').start();

import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from './libs/passport';
import userRoutes from './routes/users';
import initSession from './libs/session';

const {
    MONGODB_HOST,
    MONGODB_NAME,
    MONGODB_DEBUG,
    CRYPTO_ITERATIONS,
    CRYPTO_LENGTH,
    CRYPTO_DIGEST,
    SECRET,
    PORT,
    NODE_ENV
} = process.env;
const dev = NODE_ENV === 'development';
const app = express();

const session = initSession(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(userRoutes);
app.use(
    sapper.middleware({
        session: (req) => {
            console.log('### req.body', req.body);
            return {
                user: req.session && req.session.user,
                MONGODB_HOST,
                MONGODB_NAME,
                MONGODB_DEBUG,
                CRYPTO_ITERATIONS,
                CRYPTO_LENGTH,
                CRYPTO_DIGEST,
                SECRET,
                PORT
            };
        }
    })
);

export default app;
