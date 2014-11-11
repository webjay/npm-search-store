/*jslint node: true */
'use strict';

var MongoClient = require('mongodb').MongoClient;
var handler = require('./lib/handler');

if (!process.env.KEYWORDS) {
  return console.error('No keywords found in environment variable KEYWORDS');
}

// the keywords to search npm for
var keywords = process.env.KEYWORDS.split(',');

// database link
var dbLink = process.env.DBLINK || 'mongodb://localhost:27017/npm-search-store';

// connect MongoDB
MongoClient.connect(dbLink, function (err, db) {
  if (err) {
    return console.error(err);
  }
  // open our collection
  db.collection('packages', function (err, collection) {
    if (err) {
      return console.error(err);
    }
    // start handler
    handler(collection, keywords, function (err) {
      if (err) {
        return console.error(err);
      }
      db.close();
    });
  });
});
