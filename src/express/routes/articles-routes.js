"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);

const {getAPI} = require(`../api`);
const {dateToISOString, ensureArray, formattedDate} = require(`../../utils`);

const articlesRoutes = new Router();
const api = getAPI();
const UPLOAD_DIR = `../upload/img`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRoutes.get(`/category/:id`, async (req, res) => {
  const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories]);
  res.render(`articles/articles-by-category`, {articles, categories, title: req.params.id});
});

articlesRoutes.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/post`, {
    categories,
    today: dayjs().format(`YYYY-MM-DD`),
    endpoint: `/articles/add`
  });
});

articlesRoutes.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    photo: file || ``,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: ensureArray(body.categories),
    createdDate: dateToISOString(body.date || dayjs)
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`articles/post`, {
    article,
    categories,
    today: dayjs().format(`YYYY-MM-DD`),
    endpoint: `/articles/edit/${article.id}`
  });
});

articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/post-detail`, {article, formattedDate});
});

module.exports = articlesRoutes;
