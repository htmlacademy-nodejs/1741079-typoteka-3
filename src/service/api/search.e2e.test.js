"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {Sequelize} = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const {mockArticles, mockCategories, mockUsers} = require(`./mock`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories, users: mockUsers});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `Лучшие`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 article found`, () => expect(response.body.length).toBe(1));

  test(`Article has correct title`, () =>
    expect(response.body[0].title).toBe(`Лучшие рок-музыканты 20-века`));
});

test(`API returns code 404 if nothing is found`, () =>
  request(app).get(`/search`).query({query: `Nothing`}).expect(HttpCode.NOT_FOUND));

test(`API returns 400 when query string is absent`, () =>
  request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
