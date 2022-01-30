"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория у статьи`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Анонс статьи содержит меньше 10 символов`,
  ANNOUNCE_MAX: `Анонс статьи не может содержать более 200 символов`,
  FULL_TEXT_MIN: `Описание содержит меньше 50 символов`,
  FULL_TEXT_MAX: `Описание не может содержать более 1000 символов`
};

const schema = Joi.object({
  categories: Joi.array()
    .items(
        Joi.number().integer().positive().messages({
          "number.base": ErrorArticleMessage.CATEGORIES
        })
    )
    .min(1)
    .required(),
  title: Joi.string().min(10).max(100).required().messages({
    "string.min": ErrorArticleMessage.TITLE_MIN,
    "string.max": ErrorArticleMessage.TITLE_MAX
  }),
  announce: Joi.string().min(20).max(200).required().messages({
    "string.min": ErrorArticleMessage.ANNOUNCE_MIN,
    "string.max": ErrorArticleMessage.ANNOUNCE_MAX
  }),
  fullText: Joi.string().min(50).max(1000).required().messages({
    "string.min": ErrorArticleMessage.FULL_TEXT_MIN,
    "string.max": ErrorArticleMessage.FULL_TEXT_MAX
  }),
  photo: Joi.string()
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
