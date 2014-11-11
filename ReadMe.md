# npm-search-store

Search the npm registry and save results in MongoDB. Made to be run from a cron task.

    npm install npm-search-store -g
    
## Run

    KEYWORDS=journster npm-search-store

or if you `git pull`:

    KEYWORDS=journster npm start
  
## Environment variables

- DBLINK

  MongoDB Connection String URI.
  If not specified, it will default to: `mongodb://localhost:27017/npm-search-store`

- KEYWORDS 

  A required comma separated list of keywords to search for.

## Troubleshoot

If you see this:
  
    $ npm search journster
    npm WARN Building the local index for the first time, please be patient
    npm http GET https://registry.npmjs.org/-/all
    npm http 200 https://registry.npmjs.org/-/all
    Killed

The solution might be to download the npm cache to your machine:

    wget -O ~/.npm/-/all/.cache.json http://registry.npmjs.org/-/all

Other hacks via [npm/npm#3867](https://github.com/npm/npm/issues/3867).
Adding a swap file worked for me.
