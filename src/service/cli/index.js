"use strict";

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fillDb = require(`./filldb`);
const fill = require(`./fill`);

module.exports.Cli = {
  [fillDb.name]: fillDb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill
};
