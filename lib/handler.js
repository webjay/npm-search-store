/*jslint node: true */
'use strict';

var npmSearch = require('./npm-search');
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

    // search for packages
    search: function (callback) {
      npmSearch(keywords, callback);
    },

    // get names of packages
    names: ['search', function (callback, results) {
      callback(null, Object.keys(results.search));
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
    store: ['search', 'names', function (callback, results) {
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
