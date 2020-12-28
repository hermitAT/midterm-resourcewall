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
    SELECT *
    FROM users
    WHERE id = $1;
    `;

  return query(queryString, [id])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByID = findUserByID;

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

const passwordCheck = (password, user) => {
  if (!bcrypt.compareSync(password, user.password)) {
    return false;
  }
  return true;
};
exports.passwordCheck = passwordCheck;
