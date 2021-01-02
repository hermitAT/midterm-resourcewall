/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcrypt');
const helpers   = require('../db/helpers/user-help.js');

module.exports = (db) => {

  /*
  * Return JSON containing all users in database to client
  *
  */
  router.get('/', (req, res) => {
    helpers.getAllUsers()
      .then(users => {
        res.json({ users });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  /*
  * Log user into app given the check of email against database; getUserByEmail helper does the DB work to return the data
  * Return user object as JSON to client
  */
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    return helpers.findUserByEmail(email)
      .then(user => {
        if (!user) {
          res.json({ error: "There is no user registered under that email!"})
        } else if (bcrypt.compareSync(password, user.password)) {
          console.log("Success! Password accepted.");
          return user;
        } else {
          res.json({ error: "Password not accepted!"});
        }
      })
      .then(user => {
        return helpers.getUserData(user.id)
      })
      .then(user => res.json(user))
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post('/register', (req, res) => {
    const { name, password, email } = req.body;
    const hashPW = bcrypt.hashSync(password, 12);
    const userDetails = [name, hashPW, email];

    return helpers.newUser(userDetails)
      .then(user => {
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      })
  });

  return router;
};
