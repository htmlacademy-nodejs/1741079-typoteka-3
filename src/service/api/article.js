"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments, limit, offset} = req.query;
    const articles =
      limit || offset
        ? await service.findPage({limit, offset, comments})
        : await service.findAll(comments);

    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, [routeParamsValidator, articleExist(service)], (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(
      `/:articleId`,
      [routeParamsValidator, articleExist(service), articleValidator],
      async (req, res) => {
        const {article} = res.locals;
        const updatedArticle = await service.update(article.id, req.body);

        return res.status(HttpCode.OK).json(updatedArticle);
      }
  );

  route.delete(`/:articleId`, [routeParamsValidator, articleExist(service)], async (_req, res) => {
    const {article} = res.locals;
    const deletedArticle = await service.drop(article.id);

    return res.status(HttpCode.OK).json(deletedArticle);
  });
};
