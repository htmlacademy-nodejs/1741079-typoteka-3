"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {Sequelize} = require(`sequelize`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [`Разное`, `Музыка`];

const mockArticles = [
  {
    title: `Лучшие рок-музыканты 20-века`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    fullText: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    categories: [`Разное`, `Музыка`],
    comments: [
      {text: `Совсем немного... Хочу такую же футболку :-)`},
      {text: `Согласен с автором! Это где ж такие красоты? Совсем немного...`},
      {text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`},
      {
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());
  await initDB(mockDB, {articles: mockArticles, categories: mockCategories});
  article(app, new DataService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 1 article`, () => expect(response.body.length).toBe(1));
});

describe(`API returns an article with given id`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Лучшие рок-музыканты 20-века"`, () =>
    expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));
});

// describe(`API creates an article if data is valid`, () => {
//   const newArticle = {
//     title: `Пропал музейный кот Ося`,
//     announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
//     fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
//     categories: [1]
//   };

//   let app;
//   let response;

//   beforeAll(async () => {
//     app = await createAPI();
//     response = await request(app).post(`/articles`).send(newArticle);
//   });

//   test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

//   test(`Article count is changed`, () =>
//     request(app)
//       .get(`/articles`)
//       .expect((res) => expect(res.body.length).toBe(2)));
// });

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
    categories: [1]
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle, categories: newArticle.categories.slice(0)};
      delete badArticle[key];
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: 1234},
      {...newArticle, photo: 12345},
      {...newArticle, categories: `Котики`}
    ];
    for (const badArticle of badArticles) {
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, fullText: `short`},
      {...newArticle, title: `too short`},
      {...newArticle, categories: []}
    ];
    for (const badArticle of badArticles) {
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
    categories: [1]
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/1`)
      .expect((res) => expect(res.body.title).toBe(`Пропал музейный кот Ося`)));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
    categories: [1]
  };

  return request(app).put(`/articles/20`).send(validArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Это невалидная статья`,
    announce: `Обрати внимание невалидная статья`,
    fullText: `нет поля categories`
  };
  const app = await createAPI();

  return await request(app).put(`/articles/1`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article list is empty`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(0)));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/21`).expect(HttpCode.NOT_FOUND);
});
