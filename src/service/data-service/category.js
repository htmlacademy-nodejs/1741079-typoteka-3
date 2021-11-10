"use strict";

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, item) => {
      acc.add(item.category);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
