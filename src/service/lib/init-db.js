"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {articles, categories}) => {
  const {Article, Category} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({
        name: item
      }))
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({[next.name]: next.id, ...acc}),
      {}
  );

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(article.categories.map((name) => categoryIdByName[name]));
  });

  await Promise.all(articlePromises);
};
