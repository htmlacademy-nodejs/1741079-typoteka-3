"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {

  findAllByArticle(article) {
    return article.comments;
  }

  findOne(article, commentId) {
    return article.comments.find((item) => item.id === commentId);
  }

  create(article, comment) {
    const id = nanoid(MAX_ID_LENGTH);
    const newComment = Object.assign({id}, comment);

    article.comments.push(newComment);

    return newComment;
  }

  drop(article, commentId) {
    const dropComment = this.findOne(article, commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);

    return dropComment;
  }
}

module.exports = CommentService;
