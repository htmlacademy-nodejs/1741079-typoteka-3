"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, (_req, res) => {
    const categories = service.findAll();
    return res.status(HttpCode.OK).json(categories);
  });
};
