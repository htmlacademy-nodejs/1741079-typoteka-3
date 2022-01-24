"use strict";

const {Router} = require(`express`);

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const comment = require(`./article-comment`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const {ArticleService, CategoryService, CommentService, SearchService} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {
  const articleService = new ArticleService(sequelize);

  article(app, articleService);
  category(app, new CategoryService(sequelize));
  comment(app, articleService, new CommentService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
