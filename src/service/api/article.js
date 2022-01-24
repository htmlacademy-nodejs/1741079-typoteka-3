"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await service.findAll(comments);

    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, articleExist(service), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [articleValidator, articleExist(service)], async (req, res) => {
    const {article} = res.locals;
    const updatedArticle = await service.update(article.id, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExist(service), async (_req, res) => {
    const {article} = res.locals;
    const deletedArticle = await service.drop(article.id);

    return res.status(HttpCode.OK).json(deletedArticle);
  });
};
