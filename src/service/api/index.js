"use strict";

const {Router} = require(`express`);

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const comment = require(`./article-comment`);

const getMockData = require(`../lib/get-mock-data`);

const {ArticleService, CategoryService, CommentService, SearchService} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  const articleService = new ArticleService(mockData);

  article(app, articleService);
  category(app, new CategoryService(mockData));
  comment(app, articleService, new CommentService());
  search(app, new SearchService(mockData));
})();

module.exports = app;
