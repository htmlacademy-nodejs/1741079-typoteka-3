"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);

const {GenerateParams, DataFiles} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const logger = getLogger({name: `api`});

const generateCategories = (items) => {
  items = items.slice();
  let count = getRandomInt(1, 4);
  const result = [];
  while (count--) {
    result.push(...items.splice(getRandomInt(0, items.length - 1), 1));
  }
  return result;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (comments) => {
  const count = getRandomInt(1, GenerateParams.MAX_COMMENTS);
  return Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));
};

const generateArticles = ({count, titles, descriptions, categories, comments}) => {
  const getRandom = (arr) => arr[getRandomInt(0, arr.length - 1)];

  return Array(count)
    .fill({})
    .map(() => ({
      title: getRandom(titles),
      announce: getRandom(descriptions),
      fullText: getRandom(descriptions),
      createdDate: new Date().toISOString(),
      categories: generateCategories(categories),
      comments: generateComments(comments)
    }));
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [titles, descriptions, categories, comments] = await Promise.all(
        Object.values(DataFiles).map((file) => readContent(file))
    );

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || GenerateParams.DEFAULT_COUNT;

    const articles = generateArticles({
      count: countArticle,
      titles,
      descriptions,
      categories,
      comments
    });

    return initDb(sequelize, {articles, categories});
  }
};
