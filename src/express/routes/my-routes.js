"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {formattedDate} = require(`../../utils`);

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`my/index`, {articles, formattedDate});
});

myRoutes.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`my/comments`, {articles, formattedDate});
});

module.exports = myRoutes;
