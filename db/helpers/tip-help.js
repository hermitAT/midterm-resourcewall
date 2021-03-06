
const { query, extract } = require('../');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ get resource/comments helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Function receives an array of resource IDs and User ID
 * (may be skipped, user-specific queries will just return null)
 * Returns all fields from resources table
 * related to each resource with their creator names,
 * likes/dislikes, tags related to resource, comments count
 * and user-specific information whether
 * they liked and/or bookmarked a resource
 * @param {*} [resource_id1,...]
 */
const getResourceFullData = function(arr) {

  return Promise.all(arr.map(resource_id => {
    const queryString = `
    SELECT a.*, users.name AS creator_name,
      (SELECT ARRAY_AGG(likes.user_id)
      FROM likes
      WHERE resource_id = a.id) AS likes,
      (SELECT ARRAY_AGG(bookmarks.user_id)
      FROM bookmarks
      WHERE resource_id = a.id) AS bookmarks,
      (SELECT ARRAY_AGG(comments.id)
      FROM comments
      WHERE resource_id = a.id) AS comments,
      (SELECT STRING_AGG(tag, ' ')
      FROM resources_tags
      JOIN tags ON tag_id = tags.id
      WHERE resource_id = a.id) AS tags
    FROM resources a
    JOIN users ON creator_id = users.id
    WHERE a.id = $1;
    `;
    return query(queryString, [resource_id])
      .then(res => res.rows[0])
      .catch(err => console.log('getResourceFullData', err))
  }));
};
exports.getResourceFullData = getResourceFullData;


const getAllTipIDs = function() {

  queryString = `
  SELECT id
  FROM resources
  ORDER BY created_at DESC
  LIMIT 150;
  `;

  return query(queryString)
    .then(data => extract(data.rows, 'id'))
    .catch(err => console.error('Query error', err.stack));
};
exports.getAllTipIDs = getAllTipIDs;

/**
 * Returns count of comments the resource has (just count!)
 * for a specific post
 * @param {*} resource_id
 */
const getResourceComments = function(arr) {

  return Promise.all(arr.map(resource_id => {
    const queryString = `
      SELECT user_id, created_at, edited_at, comment
      FROM comments
      WHERE resource_id = $1
      ORDER BY created_at DESC;
    `;
    return query(queryString, [resource_id])
      .then(res => res.rows);
  }));
};
exports.getResourceComments = getResourceComments;

let queryString;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ tip modification helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
* Edit the title & description of a given Tip ID, && edited_at is set to Now(), return the updated Tip object
* Parameters are the updated title, description and the Tip ID to update
*/
const editTip = (values) => {

  queryString = `
    UPDATE resources
    SET title = $1, description = $2, edited_at = Now()
    WHERE id = $3 AND creator_id = $4
    RETURNING *;
    `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editTip = editTip;

/*
* Delete all details for a given Tip ID && log a succesful deletion to the console.
* Params in values is only the resource.id in question
*/
const deleteTip = (values) => {

  queryString = `
    DELETE FROM resources
    WHERE id = $1 AND creator_id = $2;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Resource deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteTip = deleteTip;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ like helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
* Create a 'like' for the given user/resource pair, and assign the given value to the boolean field
* Params are the active user, the Tip ID, and the given boolean value (0 creates a falsey (dislike), 1 creates a truthy (like))
*/
const setLike = (values) => {

  queryString = `
    INSERT INTO likes (user_id, resource_id)
    VALUES ($1, $2);
    `;

  return query(queryString, values)
    .then(data => console.log("Success! Like added!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.setLike = setLike;

/*
* Removes all likes that have been set for the user/tip pair (if multiple have been created due to seeds, otherwise, etc)
* Params are the active user and the Tip Id, the Tip Id is the data returned.
*/
const unsetLike = (values) => {

  queryString = `
    DELETE FROM likes
    WHERE user_id = $1 AND resource_id = $2;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Like removed!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.unsetLike = unsetLike;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ bookmark helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
* create a new bookmark for the user/tip pair
* Params are the user/tip id pair
*/
const setBookmark = (values) => {

  queryString = `
    INSERT INTO bookmarks (user_id, resource_id)
    VALUES ($1, $2);
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Bookmark added!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.setBookmark = setBookmark;

/*
* Remove the bookmark set for the user/tip pair
* Params are the user/tip id pair
*/
const unsetBookmark = (values) => {

  queryString = `
    DELETE FROM bookmarks
    WHERE user_id = $1 AND resource_id = $2;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Bookmark removed!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.unsetBookmark = unsetBookmark;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ comment helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
* Create a new comment for a given tipID, created by the active user
* Params are the user/tip id pair and the comment text
*/
const addComment = (values) => {

  queryString = `
    INSERT INTO comments (user_id, resource_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.addComment = addComment;

/*
* Delete a comment with a given id
* Param is the id of the comment to be deleted
*/
const deleteComment = (values) => {

  queryString = `
    DELETE FROM comments
    WHERE id = $1 AND resource_id = $2 AND user_id = $3;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Comment deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteComment = deleteComment;

/*
* Edit the text of a comment, and create an edited_at value of Now()
* Params are the comment id and the comment text to input
*/
const editComment = (values) => {

  queryString = `
    UPDATE comments
    SET comment = $1, edited_at = Now()
    WHERE id = $2 AND resource_id = $3 AND user_id = $4
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editComment = editComment;


/**
 * Calculate the time difference between the current moment and a given one.
 * Returns result as n minutes/hours/days/months/years ago,
 * supports singular form of units.
 * If difference is less than a minute - returns 'now'
 * @param {*} date - a Date (in ms) to calculate a difference with
 */
const timeAgo = function(date) {

  const timeMap = {
    'year' : 24 * 60 * 60 * 1000 * 365,
    'month' : 24 * 60 * 60 * 1000 * 30.42,
    'day' : 24 * 60 * 60 * 1000,
    'hour' : 60 * 60 * 1000,
    'minute' : 60 * 1000,
    'order': ['year', 'month', 'day', 'hour', 'minute']
  };

  const delta = Math.floor((Date.now() - date));
  for (const unit of timeMap.order) {
    const num = Math.floor(delta / timeMap[unit]);
    if (num >= 1) return `${num} ${unit}${(num === 1) ? '' : 's'} ago`;
  }
  return 'now';

};
exports.timeAgo = timeAgo;
