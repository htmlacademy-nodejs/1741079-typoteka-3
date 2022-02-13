"use strict";

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const csrf = require(`csurf`);

const {getAPI} = require(`../api`);
const {ensureArray, formattedDate, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);

const articlesRoutes = new Router();
const api = getAPI();
const csrfProtection = csrf();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (id) => {
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}),
    api.getCategories()
  ]);
  return [article, categories];
};

const getViewArticleData = (id) => {
  return api.getArticle(id, {comments: true});
};

articlesRoutes.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories]);

  res.render(`articles/articles-by-category`, {
    articles,
    categories,
    title: req.params.id,
    user
  });
});

articlesRoutes.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();

  res.render(`articles/post`, {
    categories,
    today: dayjs().format(`YYYY-MM-DD`),
    endpoint: `/articles/add`,
    user,
    csrfToken: req.csrfToken()
  });
});

articlesRoutes.post(`/add`, auth, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    photo: file || ``,
    announce: body.announce,
    fullText: body[`full-text`],
    publicationDate: body.date,
    categories: ensureArray(body.category)
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const {user} = req.session;
    const categories = await getAddArticleData();

    res.render(`articles/post`, {
      categories,
      validationMessages,
      today: dayjs().format(`YYYY-MM-DD`),
      endpoint: `/articles/add`,
      user
    });
  }
});

articlesRoutes.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, categories] = await Promise.all([
    api.getArticle(id, {comments: false}),
    api.getCategories()
  ]);

  res.render(`articles/post`, {
    article,
    categories,
    today: dayjs().format(`YYYY-MM-DD`),
    endpoint: `/articles/edit/${id}`,
    user,
    csrfToken: req.csrfToken()
  });
});

articlesRoutes.put(`/edit/:id`, auth, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    title: body.title,
    photo: file ? file.filename : body[`old-image`],
    announce: body.announce,
    fullText: body[`full-text`],
    publicationDate: body.date,
    categories: ensureArray(body.category)
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const {user} = req.session;
    const [articles, categories] = await getEditArticleData(id);

    res.render(`articles/post`, {
      validationMessages,
      articles,
      categories,
      today: dayjs().format(`YYYY-MM-DD`),
      endpoint: `/articles/edit/${id}`,
      user
    });
  }
});

articlesRoutes.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await getViewArticleData(id);
  res.render(`articles/post-detail`, {
    id,
    article,
    formattedDate,
    user
  });
});

articlesRoutes.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const {user} = req.session;
    const article = await getViewArticleData(id);

    res.render(`articles/post-detail`, {
      article,
      id,
      validationMessages,
      formattedDate,
      user
    });
  }
});

module.exports = articlesRoutes;
