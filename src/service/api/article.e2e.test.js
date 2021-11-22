"use strict";

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);

const mockData = [
  {
    id: `LTNBKK`,
    title: `Лучшие рок-музыканты 20-века`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    fullText: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    createdDate: `2021-11-14T16:46:47.412Z`,
    categories: [`Музыка`],
    comments: [
      {id: `gaAGG8`, text: `Совсем немного... Хочу такую же футболку :-)`},
      {id: `yVCG95`, text: `Согласен с автором! Это где ж такие красоты? Совсем немного...`},
      {id: `MX0wET`, text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`},
      {
        id: `zTPalj`,
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`
      }
    ]
  },
  {
    id: `pa-09f`,
    title: `Лучшие рок-музыканты 20-века`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    createdDate: `2021-11-14T16:46:47.412Z`,
    categories: [`Деревья`],
    comments: [
      {id: `Aw6fOF`, text: `Плюсую, но слишком много буквы!`},
      {id: `O9ytWI`, text: `Согласен с автором!`},
      {
        id: `BWKmgk`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Согласен с автором!`
      },
      {
        id: `U-OjTQ`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Это где ж такие красоты?`
      }
    ]
  },
  {
    id: `CUWBVg`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    createdDate: `2021-11-14T16:46:47.412Z`,
    categories: [`Деревья`],
    comments: [{id: `3kWn3y`, text: `Это где ж такие красоты?`}]
  },
  {
    id: `uYalg4`,
    title: `Как начать программировать`,
    announce: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    fullText: `Он написал больше 30 хитов.`,
    createdDate: `2021-11-14T16:46:47.412Z`,
    categories: [`IT`],
    comments: [
      {
        id: `vJ9B2u`,
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    id: `HTGJzm`,
    title: `Рок — это протест`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    createdDate: `2021-11-14T16:46:47.412Z`,
    categories: [`Разное`],
    comments: [
      {
        id: `-PjPWk`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Хочу такую же футболку :-)`
      },
      {id: `LbZy6q`, text: `Плюсую, но слишком много буквы! Совсем немного...`},
      {
        id: `-ISuEh`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      },
      {
        id: `UgO5L2`,
        text: `Совсем немного... Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "LTNBKK"`, () => expect(response.body[0].id).toBe(`LTNBKK`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/LTNBKK`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Лучшие рок-музыканты 20-века"`, () =>
    expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));
});

describe(`API creates an offer if data is valid`, () => {
  const newArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `Кот Ахматовой`,
    fullText: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    categories: [`Котики`],
    createdDate: `2021-11-20T11:06:57.086Z`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
    categories: [`Котики`],
    createdDate: `2021-11-20T11:06:57.086Z`
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app).post(`/articles`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Пропал музейный кот Ося`,
    announce: `В Петербурге пропал старший кот музея Ахматовой. Ему 16 лет.`,
    fullText: `Друзья, у нас беда. Потерялся самый старший музейный кот Ося. Последний раз его видели вчера, 8 октября, в саду Фонтанного Дома.`,
    categories: [`Котики`],
    createdDate: `2021-11-20T11:06:57.086Z`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/HTGJzm`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/HTGJzm`)
      .expect((res) => expect(res.body.title).toBe(`Пропал музейный кот Ося`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Это`,
    announce: `валидная статья`,
    fullText: `однако`,
    categories: [`404`],
    createdDate: `2021-11-20T11:06:57.086Z`
  };

  return request(app).put(`/articles/NOEXST`).send(validArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Это`,
    announce: `невалидная статья`,
    fullText: `нет поля categories`
  };

  return request(app).put(`/articles/NOEXST`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/CUWBVg`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`CUWBVg`));

  test(`Article count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});
