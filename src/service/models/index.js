"use strict";

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);

  ArticleCategory.init({}, {sequelize});

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Article, {
    foreignKey: `articleId`
  });

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES
  });

  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES
  });

  Category.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORIES
  });

  return {Article, ArticleCategory, Category, Comment};
};

module.exports = define;
