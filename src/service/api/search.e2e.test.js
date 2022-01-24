"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {Sequelize} = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const mockCategories = [`Железо`, `За жизнь`, `Музыка`, `IT`, `Программирование`, `Разное`];

const mockArticles = [
  {
    title: `Обзор новейшего смартфона`,
    announce: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    categories: [`За жизнь`],
    comments: [
      {text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`},
      {
        text: `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    title: `Борьба с прокрастинацией`,
    announce: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    fullText: `Собрать камни бесконечности легко если вы прирожденный герой.`,
    categories: [`Музыка`, `Разное`],
    comments: [
      {text: `Совсем немного... Согласен с автором!`},
      {
        text: `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `Борьба`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 article found`, () => expect(response.body.length).toBe(1));

  test(`Article has correct title`, () =>
    expect(response.body[0].title).toBe(`Борьба с прокрастинацией`));
});

test(`API returns code 404 if nothing is found`, () =>
  request(app).get(`/search`).query({query: `Nothing`}).expect(HttpCode.NOT_FOUND));

test(`API returns 400 when query string is absent`, () =>
  request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
