"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {formattedDate} = require(`../../utils`);
const auth = require(`../middlewares/auth`);

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`my/index`, {articles, formattedDate, user});
});

myRoutes.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles(true);

  res.render(`my/comments`, {articles, formattedDate, user});
});

module.exports = myRoutes;
