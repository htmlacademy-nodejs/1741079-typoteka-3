"use strict";

const {Sequelize} = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._category = sequelize.models.Category;
    this._articleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._category.findAll({
        attributes: [`id`, `name`, [Sequelize.fn(`COUNT`, `*`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._articleCategory,
            as: Alias.ARTICLE_CATEGORIES,
            attributes: []
          }
        ]
      });

      return result.map((it) => it.get());
    }

    return await this._category.findAll({raw: true});
  }
}

module.exports = CategoryService;
