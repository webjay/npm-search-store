/*jslint node: true */
'use strict';

var npm = require('npm');

module.exports = Npm;

function Npm (callback) {
  var conf = {
    jobs: 1
  };
  npm.load(conf, callback);
}

Npm.prototype.search = function (searchTerms, callback) {
  npm.commands.search(searchTerms, true, callback);
};

Npm.prototype.view = function (name, callback) {
  npm.commands.view([name], callback);
};
