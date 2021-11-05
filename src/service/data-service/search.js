"use strict";

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findByTitle(searchText) {
    return this._articles.filter((article) =>
      article.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

module.exports = SearchService;
