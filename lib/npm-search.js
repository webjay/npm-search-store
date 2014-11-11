/*jslint node: true */
'use strict';

var npm = require('npm');

module.exports = npmSearch;

function npmSearch (searchTerms, callback) {
  var conf = {
    jobs: 1
  };
  npm.load(conf, function (err) {
    if (err) {
      return callback(err);
    }
    npm.commands.search(searchTerms, true, callback);
  });
}
