"use strict";

const fs = require(`fs`).promises;
const {Files} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(Files.MOCK_DATA);
    data = JSON.parse(fileContent);
  } catch (e) {
    console.log(e);
  }

  return data;
};

module.exports = getMockData;
