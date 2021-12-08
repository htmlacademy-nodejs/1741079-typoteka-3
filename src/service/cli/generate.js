"use strict";

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);

const {ExitCode, MAX_ID_LENGTH, Files, GenerateParams, DataFiles} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateCategories = (categories) => {
  const count = getRandomInt(1, GenerateParams.MAX_CATEGORIES);
  const list = Array(count)
    .fill(``)
    .map(() => categories[getRandomInt(1, categories.length - 1)]);

  return [...new Set(list)];
};

const generateComments = (comments) => {
  const count = getRandomInt(1, GenerateParams.MAX_COMMENTS);
  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));
};

const generateArticles = ({count, titles, descriptions, categories, comments}) => {
  const getRandom = (arr) => arr[getRandomInt(0, arr.length - 1)];

  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      title: getRandom(titles),
      announce: getRandom(descriptions),
      fullText: getRandom(descriptions),
      createdDate: new Date().toISOString(),
      categories: generateCategories(categories),
      comments: generateComments(comments)
    }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || GenerateParams.DEFAULT_COUNT;

    const [titles, descriptions, categories, comments] = await Promise.all(
        Object.values(DataFiles).map((file) => readContent(file))
    );

    if (countArticle > GenerateParams.MAX_ARTICLE_COUNT) {
      console.error(chalk.red(`Не больше ${GenerateParams.MAX_ARTICLE_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(
        generateArticles({count: countArticle, titles, descriptions, categories, comments})
    );

    try {
      await fs.writeFile(Files.MOCK_DATA, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
