"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);
    this._articles.push(newArticle);

    return newArticle;
  }

  update(prevArticle, article) {
    return Object.assign(prevArticle, article);
  }

  drop(id) {
    const article = this.findOne(id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return article;
  }
}

module.exports = ArticleService;
