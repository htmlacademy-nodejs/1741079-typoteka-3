"use strict";

const express = require(`express`);
const request = require(`supertest`);

const ArticleDataService = require(`../data-service/article`);
const CommentDataService = require(`../data-service/comment`);
const commentsByArticle = require(`./article-comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `SPTJ2l`,
    title: `Рок — это протест`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    createdDate: `2021-11-15T08:41:45.333Z`,
    categories: [`Деревья`],
    comments: [
      {
        id: `T7E31V`,
        text: `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Это где ж такие красоты?`
      },
      {
        id: `XGdhzF`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`
      },
      {
        id: `l9WK6i`,
        text: `Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы!`
      },
      {
        id: `jLJLE4`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    id: `f81OPg`,
    title: `Обзор новейшего смартфона`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    createdDate: `2021-11-15T08:41:45.333Z`,
    categories: [`Программирование`],
    comments: [
      {
        id: `9j9LHo`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`
      },
      {
        id: `46IaSg`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Хочу такую же футболку :-)`
      },
      {id: `72-vch`, text: `Планируете записать видосик на эту тему?`},
      {id: `INX_G1`, text: `Совсем немного... Планируете записать видосик на эту тему?`}
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  commentsByArticle(app, new ArticleDataService(cloneData), new CommentDataService());
  return app;
};

describe(`API returns a comment list by article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/f81OPg/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 4 comments by article`, () => expect(response.body.length).toBe(4));

  test(`First comment's id is equals "9j9LHo"`, () => expect(response.body[0].id).toBe(`9j9LHo`));
});

test(`API refuses to get comment list to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .get(`/articles/NOEXST/comments`)
    .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `New comment`};
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/SPTJ2l/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comment count by article is changed`, () =>
    request(app)
      .get(`/articles/SPTJ2l/comments`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const newComment = {text: `New comment`};
  const app = createAPI();

  return request(app).post(`/articles/NOEXST/comments`).send(newComment).expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment by offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/SPTJ2l/comments/T7E31V`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`T7E31V`));

  test(`Comment count by article is changed`, () =>
    request(app)
      .get(`/articles/SPTJ2l/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/SPTJ2l/comments/NOEXST`).expect(HttpCode.NOT_FOUND);
});
