"use strict";

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineUser = require(`./user`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

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

  User.hasMany(Article, {
    as: Alias.ARTICLES,
    foreignKey: `userId`
  });

  Article.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`
  });

  Comment.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });

  return {Article, ArticleCategory, Category, Comment, User};
};

module.exports = define;
