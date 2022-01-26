"use strict";

const express = require(`express`);
const {Sequelize} = require(`sequelize`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/category`);
const category = require(`./category`);
const initDB = require(`../lib/init-db`);

const mockCategories = [`Железо`, `Деревья`];

const mockArticles = [
  {
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха.`,
    categories: [`Железо`],
    comments: [
      {
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`}
    ]
  },
  {
    title: `Что такое золотое сечение`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    categories: [`Деревья`],
    comments: [
      {text: `Совсем немного... Это где ж такие красоты? Хочу такую же футболку :-)`},
      {
        text: `Планируете записать видосик на эту тему? Согласен с автором! Совсем немного...`
      },
      {
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 categories`, () => expect(response.body.length).toBe(2));

  test(`Category names are "Железо", "Деревья"`, () =>
    expect(response.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Железо`, `Деревья`])
    ));
});
