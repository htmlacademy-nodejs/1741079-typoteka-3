"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const dayjs = require(`dayjs`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const {GenerateParams, DataFiles} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const logger = getLogger({name: `api`});

const getRandomFromArr = (arr) => arr[getRandomInt(0, arr.length - 1)];

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

const generateComments = ({comments, users}) => {
  const count = getRandomInt(1, GenerateParams.MAX_COMMENTS);
  return Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
      user: getRandomFromArr(users).email
    }));
};

const generateArticles = ({count, titles, descriptions, categories, comments, users}) => {
  return Array(count)
    .fill({})
    .map(() => ({
      title: getRandomFromArr(titles),
      announce: getRandomFromArr(descriptions),
      fullText: getRandomFromArr(descriptions),
      publicationDate: dayjs().format(`YYYY-MM-DD`),
      categories: generateCategories(categories),
      comments: generateComments({comments, users}),
      user: getRandomFromArr(users).email
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

    const users = [
      {
        name: `Иван`,
        surname: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: ``
      },
      {
        name: `Пётр`,
        surname: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.jpg`
      }
    ];

    const articles = generateArticles({
      count: countArticle,
      titles,
      descriptions,
      categories,
      comments,
      users
    });

    return initDb(sequelize, {articles, categories, users});
  }
};
