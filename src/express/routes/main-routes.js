"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {formattedDate, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);

const mainRoutes = new Router();
const api = getAPI();
const ARTICLES_PER_PAGE = 8;

mainRoutes.get(`/`, async (req, res) => {
  const {user} = req.session;
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
    page,
    user
  });
});

mainRoutes.get(`/register`, (req, res) => {
  const {user} = req.session;

  if (user) {
    return res.redirect(`/`);
  }

  return res.render(`sign/sign-up`);
});

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

mainRoutes.get(`/login`, (req, res) => {
  const {user} = req.session;

  if (user) {
    return res.redirect(`/`);
  }

  return res.render(`sign/login`);
});

mainRoutes.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    req.session.save(() => res.redirect(`/`));
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const {user} = req.session;

    res.render(`login`, {user, validationMessages});
  }
});

mainRoutes.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRoutes.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query: searchValue} = req.query;

  try {
    const results = await api.search(searchValue);
    res.render(`search/index`, {results, formattedDate, searchValue, user});
  } catch (e) {
    res.render(`search/index`, {results: [], searchValue, user});
  }
});

mainRoutes.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`categories/index`, {categories, user});
});

module.exports = mainRoutes;
