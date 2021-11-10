"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

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
