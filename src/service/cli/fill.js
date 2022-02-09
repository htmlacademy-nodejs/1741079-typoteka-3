"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const dayjs = require(`dayjs`);

const {Files, GenerateParams, DataFiles} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateCategories = (categoryCount) => {
  const count = getRandomInt(1, GenerateParams.MAX_CATEGORIES);
  const list = Array(count)
    .fill(``)
    .map(() => getRandomInt(1, categoryCount));

  return [...new Set(list)];
};

const generateComments = ({comments, userCount, articleId}) => {
  const count = getRandomInt(1, GenerateParams.MAX_COMMENTS);
  return Array(count)
    .fill({})
    .map(() => ({
      articleId,
      userId: getRandomInt(1, userCount),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));
};

const generateArticles = ({count, titles, descriptions, categoryCount, comments, userCount}) => {
  const getRandom = (arr) => arr[getRandomInt(0, arr.length - 1)];

  return Array(count)
    .fill({})
    .map((_, index) => ({
      title: getRandom(titles),
      announce: getRandom(descriptions),
      fullText: getRandom(descriptions),
      publicationDate: dayjs().format(`YYYY-MM-DD`),
      categories: generateCategories(categoryCount),
      comments: generateComments({comments, articleId: ++index, userCount}),
      userId: getRandomInt(1, userCount)
    }));
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || GenerateParams.DEFAULT_COUNT;

    const [titles, descriptions, categories, commentSentences] = await Promise.all(
        Object.values(DataFiles).map((file) => readContent(file))
    );

    const articles = generateArticles({
      count: countArticle,
      titles,
      descriptions,
      categoryCount: categories.length,
      comments: commentSentences,
      userCount: users.length
    });

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.reduce((acc, article, index) => {
      article.categories.forEach((category) =>
        acc.push({articleId: index + 1, categoryId: category})
      );
      return acc;
    }, []);

    const userValues = users
      .map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles
      .map(
          ({title, announce, fullText, photo, userId}) =>
            `('${title}', '${announce}', '${fullText}', '${photo || `default.jpg`}', ${userId})`
      )
      .join(`,\n`);

    const articleCategoryValues = articleCategories
      .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`)
      .join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, photo, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(Files.FILL_DB, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
