"use strict";

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.MAX_ID_LENGTH = 6;

module.exports.Files = {
  MOCK_DATA: `mocks.json`,
  FILL_DB: `fill-db.sql`
};

module.exports.DataFiles = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports.API_PREFIX = `/api`;

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.API_TIMEOUT = 1000;

module.exports.DEFAULT_API_PORT = 3000;

module.exports.DEFAULT_FRONT_SERVER_PORT = 8080;

module.exports.GenerateParams = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000,
  MAX_COMMENTS: 4,
  MAX_CATEGORIES: 3
};
