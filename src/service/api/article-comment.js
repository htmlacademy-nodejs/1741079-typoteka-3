"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAllByArticle(articleId);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(
      `/:articleId/comments`,
      [commentValidator, articleExist(articleService)],
      async (req, res) => {
        const {articleId} = req.params;
        const comment = await commentService.create(articleId, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(articleService),
      async (req, res) => {
        const {commentId} = req.params;
        const deletedComment = await commentService.drop(commentId);

        if (!deletedComment) {
          return res.status(HttpCode.NOT_FOUND).send(`Not found with ${commentId}`);
        }

        return res.status(HttpCode.OK).json(deletedComment);
      }
  );
};
