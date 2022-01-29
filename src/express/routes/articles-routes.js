"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);

const {getAPI} = require(`../api`);
const {ensureArray, formattedDate, prepareErrors} = require(`../../utils`);

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

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (id) => {
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  return [article, categories];
};

const getViewArticleData = (id, comments) => {
  return api.getArticle(id, comments);
};

articlesRoutes.get(`/category/:id`, async (req, res) => {
  const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories]);
  res.render(`articles/articles-by-category`, {articles, categories, title: req.params.id});
});

articlesRoutes.get(`/add`, async (_req, res) => {
  const categories = await getAddArticleData();
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
    categories: ensureArray(body.category)
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(ensureArray);
    const categories = await getAddArticleData();
    res.render(`articles/post`, {
      categories,
      validationMessages,
      today: dayjs().format(`YYYY-MM-DD`),
      endpoint: `/articles/add`
    });
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`articles/post`, {
    article,
    categories,
    today: dayjs().format(`YYYY-MM-DD`),
    endpoint: `/articles/edit/${id}`
  });
});

articlesRoutes.post(`/edit/:id`, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    title: body.title,
    photo: file ? file.filename : body[`old-image`],
    announce: body.announce,
    fullText: body[`full-text`],
    categories: ensureArray(body.category)
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const [articles, categories] = await getEditArticleData(id);
    res.render(`articles/post`, {
      validationMessages,
      articles,
      categories,
      today: dayjs().format(`YYYY-MM-DD`),
      endpoint: `/articles/edit/${id}`
    });
  }
});

articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getViewArticleData(id, true);
  res.render(`articles/post-detail`, {id, article, formattedDate});
});

articlesRoutes.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const article = await getViewArticleData(id, true);
    res.render(`articles/post-detail`, {article, id, validationMessages, formattedDate});
  }
});

module.exports = articlesRoutes;
