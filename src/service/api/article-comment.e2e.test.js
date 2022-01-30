"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {Sequelize} = require(`sequelize`);

const commentsByArticle = require(`./article-comment`);
const ArticleDataService = require(`../data-service/article`);
const CommentDataService = require(`../data-service/comment`);
const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [`Деревья`];

const mockArticles = [
  {
    title: `Рок — это протест`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    categories: [`Деревья`],
    comments: [
      {
        text: `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Это где ж такие красоты?`
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`
      },
      {
        text: `Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы!`
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories});
  const app = express();
  app.use(express.json());
  commentsByArticle(app, new ArticleDataService(mockDB), new CommentDataService(mockDB));
  return app;
};

describe(`API returns a comment list by article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 4 comments by article`, () => expect(response.body.length).toBe(4));
});

test(`API refuses to get comment list to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/20/comments`)
    .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`
  };
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comment count by article is changed`, () =>
    request(app)
      .get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const newComment = {text: `New comment`};
  const app = await createAPI();

  return request(app).post(`/articles/20/comments`).send(newComment).expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment by article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comment count by article is changed`, () =>
    request(app)
      .get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/1/comments/20`).expect(HttpCode.NOT_FOUND);
});
