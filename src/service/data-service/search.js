"use strict";

const {Op} = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._article = sequelize.models.Article;
    this._user = sequelize.models.User;
  }

  async findByTitle(searchText) {
    const articles = await this._article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        Alias.CATEGORIES,
        {
          model: this._user,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [[`createdAt`, `DESC`]]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
