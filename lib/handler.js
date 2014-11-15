/*jslint node: true */
'use strict';

var Npm = require('./npm-api');
var async = require('async');

module.exports = handler;

function handler (collection, keywords, callback) {

  async.auto({

    // create index
    index: function (callback) {
      collection.ensureIndex({
        name: 1,
        keywords: 1
      }, {
        unique: true,
        background: true
      }, callback);
    },

    // load npm
    npm: function (callback) {
      var npm = new Npm(function (err) {
        callback(err, npm);
      });
    },

    // search for packages
    search: ['npm', function (callback, results) {
      results.npm.search(keywords, callback);
    }],

    // get names of packages
    names: ['search', function (callback, results) {
      callback(null, Object.keys(results.search));
    }],

    // get packages info
    info: ['npm', 'names', 'search', function (callback, results) {
      async.each(results.names, function (name, callback) {
        results.npm.view(name, function (err, info) {
          if (err) return callback(err);
          var keys = Object.keys(info);
          var data = info[keys[0]];
          data = JSON.stringify(data, function (key, value) {
            return (key.indexOf('.') === -1) ? value : undefined;
          });
          data = JSON.parse(data);
          results.search[name].info = data;
          callback();
        });
      }, callback);
    }],
    
    // remove those not in search result
    clean: ['names', function (callback, results) {
      var query = {
        name: {
          $nin: results.names
        }
      };
      collection.remove(query, callback);
    }],
    
    // store results
    store: ['search', 'names', 'info', function (callback, results) {
      async.each(results.names, function (name, callback) {
        var pack = results.search[name];
        var filter = { 
          name: pack.name 
        };
        var update = {
          $set: pack
        };
        var options = {
          upsert: true,
          multi: false
        };
        collection.update(filter, update, options, callback);
      }, callback);
    }]
    
  }, callback);

}
