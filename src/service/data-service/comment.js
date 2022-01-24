"use strict";

class CommentService {
  constructor(sequelize) {
    this._article = sequelize.models.Article;
    this._comment = sequelize.models.Comment;
  }

  async findAllByArticle(articleId) {
    return await this._comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(id) {
    return await this._comment.findByPk(id);
  }

  async create(articleId, comment) {
    return await this._comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRow = await this._comment.destroy({
      where: {id}
    });

    return !!deletedRow;
  }
}

module.exports = CommentService;
