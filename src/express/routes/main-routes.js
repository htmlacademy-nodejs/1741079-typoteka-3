"use strict";

const {Router} = require(`express`);
const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => res.render(`main/index`));
mainRoutes.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`main/login`));
mainRoutes.get(`/search`, (req, res) => res.render(`main/search`));
mainRoutes.get(`/categories`, (req, res) => res.render(`main/all-categories`));

module.exports = mainRoutes;
