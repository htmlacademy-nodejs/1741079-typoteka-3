"use strict";

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const {ExitCode, MOCK_FILE_NAME, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_OFFER_COUNT = 1000;
const MAX_COMMENTS = 4;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

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
  const count = getRandomInt(1, MAX_COMMENTS);
  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));
};

const generateOffers = ({count, titles, descriptions, categories, comments}) => {
  const getRandom = (arr) => arr[getRandomInt(0, arr.length - 1)];

  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      title: getRandom(titles),
      announce: getRandom(descriptions),
      fullText: getRandom(descriptions),
      createdDate: new Date().toISOString(),
      category: getRandom(categories),
      comments: generateComments(comments)
    }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const [titles, descriptions, categories, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH)
    ]);

    if (countOffer > MAX_OFFER_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_OFFER_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(
        generateOffers({count: countOffer, titles, descriptions, categories, comments})
    );

    try {
      await fs.writeFile(MOCK_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
