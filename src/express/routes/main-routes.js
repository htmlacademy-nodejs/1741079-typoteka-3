"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {formattedDate, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);

const mainRoutes = new Router();
const api = getAPI();
const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main/index`, {
    articles,
    formattedDate,
    categories,
    hotArticles: articles.slice(0, 4),
    totalPages,
    page
  });
});

mainRoutes.get(`/register`, (_req, res) => res.render(`sign/sign-up`));

mainRoutes.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    res.render(`sign/sign-up`, {validationMessages});
  }
});

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
