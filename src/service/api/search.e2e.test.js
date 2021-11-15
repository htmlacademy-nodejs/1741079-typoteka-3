"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `4jjMMg`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Достичь успеха помогут ежедневные повторения.`,
    createdDate: `2021-11-14T15:11:59.847Z`,
    category: `Железо`,
    comments: [
      {
        id: `_s_Vy6`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`
      },
      {
        id: `gGG7on`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      },
      {
        id: `X1Ujxr`,
        text: `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    id: `X5FvEA`,
    title: `Обзор новейшего смартфона`,
    announce: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    createdDate: `2021-11-14T15:11:59.847Z`,
    category: `За жизнь`,
    comments: [
      {id: `0DnRKb`, text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`},
      {
        id: `Fy7End`,
        text: `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    id: `8w1U1E`,
    title: `Борьба с прокрастинацией`,
    announce: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    fullText: `Собрать камни бесконечности легко если вы прирожденный герой.`,
    createdDate: `2021-11-14T15:11:59.847Z`,
    category: `Музыка`,
    comments: [
      {id: `lAoncW`, text: `Совсем немного... Согласен с автором!`},
      {
        id: `LUxXcj`,
        text: `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    id: `qdyHSx`,
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    createdDate: `2021-11-14T15:11:59.847Z`,
    category: `IT`,
    comments: [
      {
        id: `tfLrQe`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Хочу такую же футболку :-)`
      },
      {
        id: `yKJ5VS`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {id: `moGkLv`, text: `Хочу такую же футболку :-)`}
    ]
  },
  {
    id: `7-GnC6`,
    title: `Борьба с прокрастинацией`,
    announce: `Программировать не настолько сложно как об этом говорят.`,
    fullText: `Как начать действовать? Для начала просто соберитесь.`,
    createdDate: `2021-11-14T15:11:59.847Z`,
    category: `Программирование`,
    comments: [
      {id: `m59-jp`, text: `Мне кажется или я уже читал это где-то?`},
      {
        id: `ungyAz`,
        text: `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        id: `sdcfcV`,
        text: `Хочу такую же футболку :-) Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `Борьба с прокрастинацией`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`2 articles found`, () => expect(response.body.length).toBe(2));

  test(`Articles have corrected ids`, () =>
    expect(response.body.map((item) => item.id)).toEqual(
        expect.arrayContaining([`8w1U1E`, `7-GnC6`])
    ));
});

test(`API returns code 404 if nothing is found`, () =>
  request(app).get(`/search`).query({query: `Nothing`}).expect(HttpCode.NOT_FOUND));

test(`API returns 400 when query string is absent`, () =>
  request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
