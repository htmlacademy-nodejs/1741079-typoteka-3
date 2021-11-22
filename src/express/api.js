"use strict";

const axios = require(`axios`);
const {DEFAULT_API_PORT, API_PREFIX, API_TIMEOUT} = require(`../constants`);

const port = process.env.API_PORT || DEFAULT_API_PORT;
const defaultURL = `http://localhost:${port}${API_PREFIX}/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({baseURL, timeout});
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories() {
    return this._load(`/categories`);
  }

  createArticle(data) {
    return this._load(`/articles`, {method: `POST`, data});
  }
}

const defaultAPI = new API(defaultURL, API_TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
