"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_NAME = `mocks.json`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, descriptions, categories) => {
  const getRandom = (arr) => arr[getRandomInt(0, arr.length - 1)];

  return Array(count)
    .fill({})
    .map(() => ({
      title: getRandom(titles),
      announce: getRandom(descriptions),
      fullText: getRandom(descriptions),
      createdDate: new Date().toISOString(),
      category: getRandom(categories)
    }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const [titles, descriptions, categories] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_CATEGORIES_PATH)
    ]);

    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, descriptions, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
