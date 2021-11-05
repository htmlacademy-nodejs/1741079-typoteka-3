"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    const updatedArticle = articleService.update(article, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAllByArticle(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, commentValidator, (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.OK).json(comment);
  });

  route.delete(
      `/:articleId/comments/:commentId`,
      [articleExist(articleService), commentValidator],
      (req, res) => {
        const {article} = res.locals;
        const {commentId} = req.params;

        const dropComment = commentService.drop(article, commentId);

        if (!dropComment) {
          return res.status(HttpCode.NOT_FOUND).send(`Not found with ${commentId}`);
        }

        return res.status(HttpCode.OK).json(dropComment);
      }
  );
};
