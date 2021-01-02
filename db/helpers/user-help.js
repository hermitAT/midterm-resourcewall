const bcrypt = require('bcrypt');
const { query } = require('../index');

let queryString;

/*
* return all user objects from database
*
*/
const getAllUsers = () => {
  queryString = `SELECT * FROM users;`;

  return query(queryString)
    .then(data => data.rows)
    .catch(err => console.error('Query error', err.stack));
};
exports.getAllUsers = getAllUsers;

/*
* Return the user object from database with the provided email
*
*/
const findUserByEmail = (email) => {

  queryString = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

  return query(queryString, [email])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByEmail = findUserByEmail;

/*
* Return the user object from database with the provided email
*
*/
const findUserByID = (id) => {

  queryString = `
    SELECT id, name, email,
      (SELECT ARRAY_AGG(resource_id) FROM likes WHERE user_id = $1) AS likes,
      (SELECT ARRAY_AGG(resource_id) FROM bookmarks WHERE user_id = $1) AS bookmarks,
      (SELECT ARRAY_AGG(id) FROM resources WHERE creator_id = $1) AS created_tips
    FROM users
    WHERE id = $1;
    `;

  return query(queryString, [id])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.getUserData = findUserByID;

/*
* Create a new user object in the database with their provided their name, email and password
*
*/
const newUser = (userDetails) => {
  // functionality to add a new user into the database and returning the new user object

  queryString = `
      INSERT INTO users (name, password, email)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
      `;

  return query(queryString, userDetails)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));

};
exports.newUser = newUser;
