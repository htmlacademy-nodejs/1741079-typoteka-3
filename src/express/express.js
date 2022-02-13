"use strict";

const express = require(`express`);
const path = require(`path`);
const bodyParser = require(`body-parser`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const sequelize = require(`../service/lib/sequelize`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {DEFAULT_FRONT_SERVER_PORT, HttpCode} = require(`../constants`);

const SESSION_SECRET = process.env.SESSION_SECRET;
const port = process.env.port || DEFAULT_FRONT_SERVER_PORT;
const PUBLIC_DIR = `public`;
const TEMPLATE_DIR = `templates`;
const UPLOAD_DIR = `upload`;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false
    })
);

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((_req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((_err, _req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, TEMPLATE_DIR));
app.set(`view engine`, `pug`);

app.listen(port);
