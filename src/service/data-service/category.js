"use strict";

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, item) => acc.concat(item.categories), []);

    return [...new Set(categories)];
  }
}

module.exports = CategoryService;
