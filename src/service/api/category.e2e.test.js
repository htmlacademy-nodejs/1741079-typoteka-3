"use strict";

const express = require(`express`);
const {Sequelize} = require(`sequelize`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/category`);
const category = require(`./category`);
const initDB = require(`../lib/init-db`);
const {mockCategories, mockArticles, mockUsers} = require(`./mock`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories, users: mockUsers});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 categories`, () => expect(response.body.length).toBe(2));

  test(`Category names are "Разное", "Музыка"`, () =>
    expect(response.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Разное`, `Музыка`])
    ));
});
