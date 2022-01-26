"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {formattedDate} = require(`../../utils`);

const mainRoutes = new Router();
const api = getAPI();

mainRoutes.get(`/`, async (_req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`main/index`, {
    articles,
    formattedDate,
    categories,
    hotArticles: articles.slice(0, 4)
  });
});

mainRoutes.get(`/register`, (_req, res) => res.render(`sign/sign-up`));

mainRoutes.get(`/login`, (_req, res) => res.render(`sign/login`));

mainRoutes.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;

  try {
    const results = await api.search(searchValue);
    res.render(`search/index`, {results, formattedDate, searchValue});
  } catch (e) {
    res.render(`search/index`, {results: [], searchValue});
  }
});

mainRoutes.get(`/categories`, async (_req, res) => {
  const categories = await api.getCategories();
  res.render(`categories/index`, {categories});
});

module.exports = mainRoutes;
