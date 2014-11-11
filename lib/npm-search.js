/*jslint node: true */
'use strict';

var npm = require('npm');

module.exports = npmSearch;

function npmSearch (searchTerms, callback) {
  npm.load(function (err) {
    if (err) {
      return callback(err);
    }
    npm.commands.search(searchTerms, true, callback);
  });
}
