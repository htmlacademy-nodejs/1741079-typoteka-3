"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        announce: {
          type: DataTypes.STRING,
          allowNull: false
        },
        fullText: {
        // eslint-disable-next-line new-cap
          type: DataTypes.STRING(100),
          allowNull: false
        },
        photo: DataTypes.STRING,
        publicationDate: {
          type: DataTypes.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`
      }
  );

module.exports = define;
