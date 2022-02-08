"use strict";

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._article = sequelize.models.Article;
    this._category = sequelize.models.Category;
    this._comment = sequelize.models.Comment;
    this._user = sequelize.models.User;
  }

  async findAll(needComments) {
    const userModel = {
      model: this._user,
      as: Alias.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    };

    const include = [Alias.CATEGORIES, userModel];

    if (needComments) {
      include.push({
        model: this._comment,
        as: Alias.COMMENTS,
        include: [userModel]
      });
    }

    const articles = await this._article.findAll({
      include,
      order: [[`createdAt`, `DESC`]]
    });

    return articles.map((article) => article.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Alias.CATEGORIES];

    if (comments) {
      include.push(Alias.COMMENTS);
    }

    const {count, rows} = await this._article.findAndCountAll({
      limit,
      offset,
      include,
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });

    return {count, articles: rows};
  }

  async findOne(id, needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    return await this._article.findByPk(id, {include});
  }

  async create(data) {
    const article = await this._article.create(data);
    await article.addCategories(data.categories);
    return article.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedArticle = await this._article.destroy({
      where: {id}
    });

    return !!deletedArticle;
  }
}

module.exports = ArticleService;
