/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const searchHelp = require('../db/helpers/search-help');
const querystring = require('querystring');

module.exports = () => {


  // Get list of currently valid tags
  router.get("/tags", (req, res) => {
    searchHelp.getTagsList()
      .then(tags => res.json(tags));
  });


  router.get("/", (req, res) => {

    const tags = JSON.parse(req.query.tags);

    searchHelp.searchByTags(tags)
      .then(tips => res.json(tips))
      .catch(err => err);

  });

  router.get("/results", (req, res) => {
    res.render('search');
    // ^^ add { userId } to the render args..
  });

  return router;

};
