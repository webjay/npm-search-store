# npm-search-store

Search the npm registry and save results in MongoDB. Made to be run from a cron task.

    npm install npm-search-store -g
    
## Run

    KEYWORDS=journster npm start
  
## Environment variables

- DBLINK

  MongoDB Connection String URI.
  If not specified, it will default to `mongodb://localhost:27017/npm-search-store`.

- KEYWORDS 

  A required comma separated list of keywords to search for.
