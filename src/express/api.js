"use strict";

const axios = require(`axios`);
const {DEFAULT_API_PORT, API_PREFIX, API_TIMEOUT, HttpMethod} = require(`../constants`);

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

  getArticles({comments, limit, offset}) {
    return this._load(`/articles`, {params: {comments, limit, offset}});
  }

  getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {method: HttpMethod.POST, data});
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultURL, API_TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
