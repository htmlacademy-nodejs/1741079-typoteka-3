"use strict";

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/category`);
const category = require(`./category`);

const mockData = [
  {
    id: `meAIdT`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха.`,
    createdDate: `2021-11-14T15:40:33.321Z`,
    category: `Железо`,
    comments: [
      {
        id: `6BN2qm`,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {id: `XFKm8x`, text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`}
    ]
  },
  {
    id: `UuHAHP`,
    title: `Что такое золотое сечение`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    createdDate: `2021-11-14T15:40:33.321Z`,
    category: `Деревья`,
    comments: [
      {id: `qUoKLA`, text: `Совсем немного... Это где ж такие красоты? Хочу такую же футболку :-)`},
      {
        id: `nkpB3r`,
        text: `Планируете записать видосик на эту тему? Согласен с автором! Совсем немного...`
      },
      {
        id: `ausfcN`,
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    id: `21RCQM`,
    title: `Обзор новейшего смартфона`,
    announce: `Он написал больше 30 хитов.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха.`,
    createdDate: `2021-11-14T15:40:33.321Z`,
    category: `За жизнь`,
    comments: [
      {
        id: `9JnAS5`,
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?`
      },
      {
        id: `cT2dCB`,
        text: `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const app = express();
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Железо", "Деревья", "За жизнь"`, () =>
    expect(response.body).toEqual(expect.arrayContaining([`Железо`, `Деревья`, `За жизнь`])));
});
