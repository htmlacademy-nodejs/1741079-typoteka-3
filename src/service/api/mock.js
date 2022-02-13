"use strict";

const mockCategories = [`Разное`, `Музыка`];
const passwordUtils = require(`../lib/password`);

const mockUsers = [
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: ``
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockArticles = [
  {
    title: `Лучшие рок-музыканты 20-века`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.`,
    fullText: `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    categories: [`Разное`, `Музыка`],
    user: `ivanov@example.com`,
    publicationDate: `2021-07-05`,
    comments: [
      {text: `Совсем немного... Хочу такую же футболку :-)`, user: `ivanov@example.com`},
      {
        text: `Согласен с автором! Это где ж такие красоты? Совсем немного...`,
        user: `petrov@example.com`
      },
      {
        text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`,
        user: `petrov@example.com`
      },
      {
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`,
        user: `ivanov@example.com`
      }
    ]
  }
];

module.exports = {mockArticles, mockUsers, mockCategories};
