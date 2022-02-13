"use strict";

const {Sequelize} = require(`sequelize`);
const express = require(`express`);
const request = require(`supertest`);

const DataService = require(`./../data-service/user`);
const {mockArticles, mockCategories, mockUsers} = require(`./mock`);
const article = require(`./user`);
const initDB = require(`./../lib/init-db`);
const {HttpCode} = require(`../../constants`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories, users: mockUsers});
  article(app, new DataService(mockDB));
  return app;
};

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    name: `Сидор`,
    surname: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: ``
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      if (key === `avatar`) {
        return;
      }
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1},
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];

    for (const badUserData of badUsers) {
      await request(app).post(`/user`).send(badUserData).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app).post(`/user`).send(badUserData);
  });
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`User surname is "Иванов"`, () => expect(response.body.surname).toBe(`Иванов`));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If emai is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `non-exist@example.com`,
      password: `petrov`
    };

    await request(app).post(`/user/auth`).send(badAuthData).expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov`
    };

    await request(app).post(`/user/auth`).send(badAuthData).expect(HttpCode.UNAUTHORIZED);
  });
});
