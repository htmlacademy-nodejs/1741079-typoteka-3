"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/comments`, route);

  route.get(`/`, (req, res) => {
    const comments = service.findAll();
    return res.status(HttpCode.OK).json(comments);
  });
};
