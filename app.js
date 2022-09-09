import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'

const appSettings = {
    appCredentials: {
        clientId:  "1d73d714-89d8-49c9-affd-627db37af46f",
    	tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret:  "M248Q~~Z.ZgKNSH2E8E~NmyA1wpzPq3N6k2W4dqX"
    },	

    authRoutes: {
        redirect: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};


import indexRouter from './routes/index.js';
import apiRouter from './routes/api/v1/api.js';
import models from './models.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up5ew4e[9umvecwljcl'sa",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))
const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use(express.static(path.join(__dirname, 'public')));

// add "models" to the request
app.use((req, res, next) => {
    req.models = models
    next();
})

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

app.get('/signin',
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res, next) => {
    res.send("there was a server error")
})

app.get('/unauthorized', (req, res, next) => {
    res.send("permission was denied")
})


export default app;
