"use strict";

const http = require(`http`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {HttpCode, MOCK_FILE_NAME} = require(`./../../constants`);
const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  const template = `
  <!Doctype html>
    <html lang="ru">
    <head>
      <title>With love from Node</title>
    </head>
    <body>${message}</body>
  </html>`.trim();

  res.writeHead(statusCode, {
    "Content-Type": `text/html; charset=UTF-8`
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(MOCK_FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (e) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http
      .createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.log(chalk.gray(`Waiting to connect on ${port}`));
      })
      .on(`error`, ({message}) => {
        console.log(chalk.red(`Error on create server: ${message}`));
      });
  }
};
