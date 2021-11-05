"use strict";

const fs = require(`fs`).promises;
const {MOCK_FILE_NAME} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(MOCK_FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (e) {
    console.log(e);
  }

  return data;
};

module.exports = getMockData;
