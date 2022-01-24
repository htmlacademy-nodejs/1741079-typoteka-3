"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const searchResult = await service.findByTitle(query);
    const searchStatus = searchResult.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResult);
  });
};
