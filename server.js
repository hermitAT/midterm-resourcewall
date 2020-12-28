// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8001;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const morgan     = require('morgan');
const app        = express();

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

exports.db = db;

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use( morgan('dev') );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( express.static("public") );

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");
const tipRoutes = require("./routes/tips");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/search", searchRoutes(db));
app.use("/user", userRoutes(db));
app.use("/tips", tipRoutes(db));

// ----- Main Error catching can go here -----

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
